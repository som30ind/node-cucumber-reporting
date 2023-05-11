const { ReportBuilder } = require('../dist/types');

const reportBuilder = new ReportBuilder([
  './test-resources/json/sample.json',
  './test-resources/json/simple.json',
  './test-resources/json/timestamped/*.json',
  './test-resources/json/timestamped/*.json',
], {
  reportDir: 'report-html',
  projectName: `Somnath's Project`,
  buildNumber: '1',
  presentationModes: [
    // 'RUN_WITH_JENKINS',
    'PARALLEL_TESTING'
  ],
  notFailingStatuses: [
    'SKIPPED'
  ],
  classifications: {
    'Platform': 'Windows',
    'Browser': 'Firefox',
    'Branch': 'release/1.0',
  },
  classificationFiles: [
    './test-resources/classifications/sample_one.json',
    './test-resources/classifications/sample_two.json'
  ],
  qualifiers: {
    'cucumber-report-1': 'First report',
    'cucumber-report-2': 'Second report'
  }
});
const result = reportBuilder.generateReports();

console.log(result);

// File reportOutputDirectory = new File("target");
// List < String > jsonFiles = new ArrayList <> ();
// jsonFiles.add("cucumber-report-1.json");
// jsonFiles.add("cucumber-report-2.json");

// String buildNumber = "1";
// String projectName = "cucumberProject";

// Configuration configuration = new Configuration(reportOutputDirectory, projectName);
// // optional configuration - check javadoc for details
// configuration.addPresentationModes(PresentationMode.RUN_WITH_JENKINS);
// // do not make scenario failed when step has status SKIPPED
// configuration.setNotFailingStatuses(Collections.singleton(Status.SKIPPED));
// configuration.setBuildNumber(buildNumber);
// // addidtional metadata presented on main page
// configuration.addClassifications("Platform", "Windows");
// configuration.addClassifications("Browser", "Firefox");
// configuration.addClassifications("Branch", "release/1.0");

// // optionally add metadata presented on main page via properties file
// List < String > classificationFiles = new ArrayList <> ();
// classificationFiles.add("properties-1.properties");
// classificationFiles.add("properties-2.properties");
// configuration.addClassificationFiles(classificationFiles);

// // optionally specify qualifiers for each of the report json files
// configuration.addPresentationModes(PresentationMode.PARALLEL_TESTING);
// configuration.setQualifier("cucumber-report-1", "First report");
// configuration.setQualifier("cucumber-report-2", "Second report");

//         ReportBuilder reportBuilder = new ReportBuilder(jsonFiles, configuration);
//         Reportable result = reportBuilder.generateReports();
// // and here validate 'result' to decide what to do if report has failed
