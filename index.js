let fs = require("fs")
const input = fs.readFileSync("./input.txt", "utf-8")

// Split the input so each line is an element. Then split each line into an array of words.
function splitArr(input) {
  const inputArr = input.split('\r\n').map(line => line.split(' '))
  return inputArr
}

// Parse through the input array and create a map for each patient. Return a map of maps.
function createPatientMaps(inputArr) {
  const patientMaps = new Map()

  for (const line of inputArr) {
    if (line[0] === 'Patient') {
      const name = line[1]
      patientMaps.set(name, new Map(
        [
          ['name', name],
          ['durationOfStay', {
            minutes: null,
            hours: null
          }],
          ['dateIntake', null],
          ['dateDischarge', null],
          ['treatments', new Set()]
        ]
      ))
    }
  }

  return patientMaps
}

// Parse through the input array and set "actions" to patient maps.
function setPatientMaps(patientMaps, inputArr) {
  for (const line of inputArr) {
    if (line[0] !== 'Action') continue
    const action = line[1]
    const name = line[2]
    const date = line[3]
    const treatment = line[4]

    if (action === 'Intake') patientMaps.get(name).set('dateIntake', date)
    if (action === 'Discharge') patientMaps.get(name).set('dateDischarge', date)
    if (action === 'Treatment') patientMaps.get(name).get('treatments').add(treatment)
  }

  return patientMaps
}

// Iterate through patient maps and set total duration hours and minutes.
function setPatientDuration(patientMaps) {
  for (const [key, value] of patientMaps) {
    const dateIntake = new Date(value.get('dateIntake'))
    const dateDischarge = new Date(value.get('dateDischarge'))

    const milliseconds = Math.abs(dateIntake - dateDischarge)
    const minutes = ((milliseconds / 1000 / 60) % 60).toFixed(1)
    const hours = Math.floor((milliseconds / 1000 / 60) / 60).toFixed(1)

    value.get('durationOfStay').minutes = minutes
    value.get('durationOfStay').hours = hours
  }

  return patientMaps
}

// Iterate through patient maps, format strings, and output result.
function formatPatientMaps(patientMaps) {
  for (const [key, value] of patientMaps) {
    console.log(`Patient ${value.get('name')} stayed for ${value.get('durationOfStay').hours} hours and ${value.get('durationOfStay').minutes} minutes and received ${value.get('treatments').size} treatments`)
  }
}

const inputArr = splitArr(input)
let patientMaps = createPatientMaps(inputArr)
patientMaps = setPatientMaps(patientMaps, inputArr)
patientMaps = setPatientDuration(patientMaps)
formatPatientMaps(patientMaps)