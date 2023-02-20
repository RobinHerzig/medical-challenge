## Instructions:

Build a tool that takes an input file and returns formatted patient data.

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

Assume the following in a correct input:

- The patient will always be declared with a patient line before their actions are logged.
- The patient will always have an intake and discharge action line with accurate times (Zulu), though sorting may be mixed.
- The patient will always have at least 1 treatment action line.
- If multiple patients are included, their patient lines and action lines will be mixed throughout the file. However, they will still respect the above rules.

## How It's Made:

I built this program using Node.js v18.5.0 and JavaScript. It consists of three main files:

1. outputPatientStrings.js
2. outputPatientStrings.test.js
3. input.txt

In addition, this project includes Jest, a testing framework maintained by Meta, and Prettier, a code formatter used to enforce consistent styling.

### outputPatientStrings.js:

This file contains the program's logic. Its purpose is to receive patient data and return formatted patient strings. It follows several straightforward steps:

1. Split the input data into arrays.
2. Iterate through the arrays. For each patient line, create a patient `Map` object.
3. Iterate through the arrays. For each action line, add the data in the respective patient `Map` object.
4. Iterate through the patient `Map` objects. For each patient, use their intake date and discharge dates to calculate the duration of their stay.
5. Iterate through the patient `Map` objects. For each patient, use the information gathered to complete the template literal.
6. Return the patient strings to the calling function.

Each of the above steps is encapsulated in its own function. This ensures that the code is easier to read, debug, and scale as the project requirements grow.

### outputPatientStrings.test.js:

This file contains the code used to test the program, which is also organized into straightforward steps:

1. Import the `outputPatientStrings.js` logic functions and the `input.txt` sample dataset.
2. Declare the testing functions. To provide context, each test includes a description of what case is being tested:
    1. Test that the actual output matches the expected output when using the sample dataset.
    2. Test that the actual output matches the expected output when using an empty dataset.
    3. Test that the actual output matches the expected output when using a dataset where a patient's name contains a space.

Information on running these tests is provided below in the **Installation** section of this readme.

### input.txt:

Plain text document containing the provided sample dataset.

## Optimizations:

Although there are formatting rules for the dataset prior to input, there are still two edge cases that could potentially occur:

1. The input dataset is empty.
2. The input dataset includes a patient with a space in their name (e.g. John Sr).

I addressed the second case during the initial splitting of the input into arrays, as that would make the later steps of iterating through the dataset much simpler.

To solve the problem, I created conditions that compared the actual line length to the expected line length, taking into account whether it was a patient or action line, and, if the latter, the type of action. By considering the expected format of the line, the data can be manipulated as follows:

```const line = ['Action', 'Intake', 'John', 'Sr', '2023-01-06T09:45:00Z'];```

```let lineFixed = [line[0], line[1], ..., line.at(-1)];```

By deduction, the elements inside `...` can only contain the patient's name. It can be sliced from the original array and joined into a single string:

```const name = line.slice(2, line.length - 1).join(' ');``` // 'John Sr'

```lineFixed = [line[0], line[1], name, line.at(-1)];```

End result: `['Action', 'Intake', 'John Sr', '2023-01-06T09:45:00Z']`

## Issues:

Returning to the requirements of the challenge, there are a few other issues that remain:

1. It is not specified whether a patient may receive the same treatment twice in the same visit. However, the instructions do specify to return the number of *different* treatments. As such, patient treatments are stored in a `Set` object as they only add unique values.
2. Patients who share a name will interfere with the accuracy of the program. As such, unique IDs would be strongly recommended.
3. If there were the possibility of mistakes in the dataset, try-catch blocks should be used to handle errors.

## Performance:

When writing this program, one of my goals was to ensure optimal performance for larger datasets. I achieved this by implementing two main optimizations:

1. By avoiding nested loops, each function has a time complexity of O(n) or better. This was the most important step.
2. `Map` objects were deliberately chosen over their standard object counterpart, as they provide better performance. For example, testing shows they can perform approximately 45 times faster when setting, or adding, entries.

## Installation:

1. Download or clone the repo onto your local machine.
2. In your terminal, enter `npm install` to download and install the dependencies.
3. In the terminal, enter `npm test` to run the test.

## Feedback:

Thanks for this challenge, I enjoyed it a lot. If you have any questions or comments, don't hesitate to contact me.