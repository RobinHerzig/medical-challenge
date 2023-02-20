/**
 * Split the input data so each line is an element. Then split each line into an array of words.
 * @param {string} input Test file.
 * @return {Array<Array<string>>} Data formatted into 2 dimensional array.
 */
function formatInput(input) {
  let inputArr = input.split(/\r?\n/);
  inputArr = inputArr.map((line) => {
    line = line.split(' ');
    line = joinPatientNames(line);
    return line;
  });
  return inputArr;
}

/**
 * If the patient has multiple names, join them as a single element.
 * @param {array<string>} line A split line from the input.
 * @return {array<string>} A split line with all name information in a single element.
 */
function joinPatientNames(line) {
  const keyword = line[0];

  if (keyword === 'Patient' && line.length > 2) {
    const name = line.slice(1).join(' ');
    line = [keyword, name];
    return line;
  }

  const action = line[1];
  if ((action === 'Intake' || action === 'Discharge') && line.length > 4) {
    const name = line.slice(2, line.length - 1).join(' ');
    const date = line.at(-1);
    line = [keyword, action, name, date];
    return line;
  }

  if (action === 'Treatment' && line.length > 5) {
    const name = line.slice(2, line.length - 2).join(' ');
    const date = line.at(-2);
    const treatment = line.at(-1);
    line = [keyword, action, name, date, treatment];
    return line;
  }

  return line;
}

/**
 * Parse through the input array and create a map for each patient. Return a map of maps.
 * @param {Array<Array<string>>} inputArr Data formatted into 2 dimensional array.
 * @return {Map<Map<string>>} Data formatted into 2 dimensional maps.
 */
function createPatientMaps(inputArr) {
  const patientMaps = new Map();

  for (const line of inputArr) {
    if (line[0] === 'Patient') {
      const name = line[1];
      patientMaps.set(
        name,
        new Map([
          ['name', name],
          [
            'durationOfStay',
            {
              minutes: null,
              hours: null
            }
          ],
          ['dateIntake', null],
          ['dateDischarge', null],
          ['treatments', new Set()]
        ])
      );
    }
  }

  return patientMaps;
}

/**
 * Parse through the input array and set "actions" to patient maps.
 * @param {Map<Map<string>>} patientMaps Data formatted into 2 dimensional maps.
 * @param {Array<Array<string>>} inputArr Data formatted into 2 dimensional array.
 * @return {Map<Map<string>>} Data formatted into 2 dimensional maps.
 */
function setPatientActions(patientMaps, inputArr) {
  for (const line of inputArr) {
    const [keyword, action, name, date, treatment] = line;

    if (keyword !== 'Action') continue;
    if (action === 'Intake') patientMaps.get(name).set('dateIntake', date);
    if (action === 'Treatment') patientMaps.get(name).get('treatments').add(treatment);
    if (action === 'Discharge') patientMaps.get(name).set('dateDischarge', date);
  }

  return patientMaps;
}

/**
 * Iterate through patient maps and set total duration hours and minutes.
 * @param {Map<Map<string>>} patientMaps Data formatted into 2 dimensional maps.
 * @return {Map<Map<string>>} Data formatted into 2 dimensional maps.
 */
function setPatientDuration(patientMaps) {
  for (const patient of patientMaps.values()) {
    const dateIntake = new Date(patient.get('dateIntake'));
    const dateDischarge = new Date(patient.get('dateDischarge'));

    const milliseconds = Math.abs(dateIntake - dateDischarge);
    const minutes = ((milliseconds / 1000 / 60) % 60).toFixed(1);
    const hours = Math.floor(milliseconds / 1000 / 60 / 60).toFixed(1);

    patient.get('durationOfStay').minutes = minutes;
    patient.get('durationOfStay').hours = hours;
  }

  return patientMaps;
}

/**
 * Iterate through patient maps, format strings, and output result.
 * @param {Map<Map<string>>} patientMaps Data formatted into 2 dimensional maps.
 * @return {Array<string>} Formatted patient strings inside an array.
 */
function createPatientStrings(patientMaps) {
  const output = [];
  for (const patient of patientMaps.values()) {
    const patientStr = `Patient ${patient.get('name')} stayed for ${patient.get('durationOfStay').hours} hours and ${
      patient.get('durationOfStay').minutes
    } minutes and received ${patient.get('treatments').size} treatments`;
    output.push(patientStr);
  }

  return output;
}

function outputPatientStrings(input) {
  const inputArr = formatInput(input);
  let patientMaps = createPatientMaps(inputArr);
  patientMaps = setPatientActions(patientMaps, inputArr);
  patientMaps = setPatientDuration(patientMaps);
  patientOutput = createPatientStrings(patientMaps);

  return patientOutput;
}

module.exports = { outputPatientStrings };
