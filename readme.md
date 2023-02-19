## Instructions:

Build a tool that takes an input file and returns formatted patient data. For example:

Example Input:
```
Patient John
Action Intake John 2023-01-06T09:45:00Z
Action Discharge John 2023-01-15T15:58:00Z
Action Treatment John 2023-01-09T11:35:00Z F5GZ
Patient Anne
Action Treatment John 2023-01-07T07:11:00Z GG34
Action Treatment John 2023-01-08T06:24:00Z BZ42
Action Intake Anne 2023-01-04T01:22:00Z
Action Treatment John 2023-01-10T16:36:00Z R0F1
Action Treatment Anne 2023-01-05T22:23:00Z R0F1
Action Discharge Anne 2023-01-09T04:56:00Z
Patient Polly
Action Intake Polly 2023-01-09T12:00:00Z
Action Treatment Polly 2023-01-09T13:00:00Z GG34
Action Treatment Polly 2023-01-09T13:00:00Z R0F1
Action Discharge Polly 2023-01-10T12:00:00Z
```

Expected Output:
```
Patient John stayed for 222.0 hours and 13.0 minutes and received 4 treatments
Patient Anne stayed for 123.0 hours and 34.0 minutes and received 1 treatments
Patient Polly stayed for 24.0 hours and 0.0 minutes and received 2 treatments
```

Assume the following for a correct input:
- The patient will always be declared before their actions are logged.
- The patient will always have an intake and discharge action with accurate times (Zulu), though sorting may be mixed.
- The patient will always have at least 1 treatment action.
- When multiple patients are included, their declarations and actions will be mixed throughout the file. However, they will still respect the above rules.

## How It's Made:

I built the tool using Node.js and JavaScript, and used Jest for testing. Prettier is included to ensure consistent formatting.

Tool: **outputPatientData.js**
Testing: **outputPatientData.test.js**
Input: **input.txt**

### outputPatientData.js:
This file consists of 6 functions. Briefly, their purposes are:
- formatInput: Format the input into arrays to prepare it for reference.
- createPatientMaps: Iterate through the input array and construct a new map for each patient declaration.
- setPatientActions: Populate the patient's action properties, such as date of intake, treatment, and date of discharge.
- setPatientDuration: Calculate the duration of the patient's visit.
- outputPatientMaps: Create a string for each patient, using the maps to complete the template literal.

The functions are designed to encapsulate a single purpose.

### outputPatientData.test.js:
Contains 3 tests:
- Test that the actual output matches the expected output when using sample data.
- Test that the actual output matches the expected output when using no data.
- Test that the actaul output matches the expected output when names contain spaces. For example, 'John Sr' and 'John' should be considered seperate patients.

### input.txt:
Plain text document containing a sample input.

## Optimizations:

While creating this program, my focus was on writing optimized code.
- Maps were used for their great performance when adding and modifying properties, improving performance at scale.
- Likewise, all functions have a time complexity of O(n), ensuring fast performance.

Due to the wording of the challenge, I anticipated a couple edge cases:
- It is not specified that the patient's name will always be a single word. As a result, the patient information is formatted in a way that, if more than one name is provided, all will be included in the name element.
- It is not specified that a patient will never recieve the same treatment twice in the same visit. However, the instructions do ask for the number of *different* treatments. As such, a set is used to store treatments. This is because sets, unlike arrays, only store unique sets of data.

However, there is still room for improvement. Should development of this project continue, I would recommend the following:
- First and foremost, patients should be identified using unique IDs, not names. This ensures that two patients sharing the same name won't interfere with each other.
- If there is a possibility for mistakes in the data, try-catch blocks should be used to handle errors.

## Installation:

1. Download or clone the repo onto your local machine.
2. In your terminal, enter `npm install` to download and install the dependencies.
3. In the terminal, enter `npm test` to run the test.

## Feedback:

This was an enjoyable challenge. Feedback is welcome.