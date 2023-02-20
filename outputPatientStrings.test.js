const { outputPatientStrings } = require('./outputPatientStrings');
let fs = require('fs');

describe('with given input.txt sample dataset', () => {
  const input = fs.readFileSync('./input.txt', 'utf-8');
  let result;

  beforeEach(() => {
    result = outputPatientStrings(input);
  });

  test('it should return the expected ouput', () => {
    expect(result).toEqual([
      'Patient John stayed for 222.0 hours and 13.0 minutes and received 4 treatments',
      'Patient Anne stayed for 123.0 hours and 34.0 minutes and received 1 treatments',
      'Patient Polly stayed for 24.0 hours and 0.0 minutes and received 2 treatments'
    ]);
  });
});

describe('input edge cases', () => {
  describe('when input is empty', () => {
    const input = '';
    let result;

    beforeEach(() => {
      result = outputPatientStrings(input);
    });

    test('it should return empty array', () => {
      expect(result).toEqual([]);
    });
  });
  describe("when a patient's name contains space", () => {
    const input = `Patient John Sr\nAction Intake John Sr 2023-01-06T09:45:00Z\nAction Discharge John Sr 2023-01-15T15:58:00Z\nAction Treatment John Sr 2023-01-09T11:35:00Z F5GZ\nPatient John\nAction Treatment John Sr 2023-01-07T07:11:00Z GG34\nAction Treatment John Sr 2023-01-08T06:24:00Z BZ42\nAction Intake John 2023-01-04T01:22:00Z\nAction Treatment John Sr 2023-01-10T16:36:00Z R0F1\nAction Treatment John 2023-01-05T22:23:00Z R0F1\nAction Discharge John 2023-01-09T04:56:00Z`;
    let result;

    beforeEach(() => {
      result = outputPatientStrings(input);
    });

    test('it should preseve the full name', () => {
      expect(result).toEqual([
        'Patient John Sr stayed for 222.0 hours and 13.0 minutes and received 4 treatments',
        'Patient John stayed for 123.0 hours and 34.0 minutes and received 1 treatments'
      ]);
    });
  });
});
