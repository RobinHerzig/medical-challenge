
// Import the patientMaps
// Calculate the sum, set it as part of the patien map
// Return the patient map.


let fs = require('fs');
const inputcodes = fs.readFileSync('./inputcodes.txt', 'utf-8');

// Reassign text to object prop/value pairs
function reassignCodesToObject(inputcodes) {
  // split
  // iterate through the array
  // assign to object

  const inputCodesObject = {}

  let inputCodesArr = inputcodes.split(/\r?\n/);
  inputCodesArr = inputCodesArr.map(line => line.split(' '));
  
  for (const line of inputCodesArr) {
    inputCodesObject[line[0]] = line[1]
  }
  
  return inputCodesObject
}

function calculatePatientTreatmentScore(patientMaps, inputCodesObject) {
  let sum = 0

  for (const patient of patientMaps.values()) {
    const treatmentArr = patient.get('treatments')
    sum = treatmentArr.reduce((a, c) => Number(inputCodesObject[c]) + a, 0)
    patient.set('treatmentSum', sum);
  }

  return patientMaps
}

function calculatePatientScores(patientMaps) {
  let inputCodesObject = reassignCodesToObject(inputcodes)
  return calculatePatientTreatmentScore(patientMaps, inputCodesObject)
}


module.exports = { calculatePatientScores };