const { render } = require('ejs');
const { readFileSync, outputFileSync, readJsonSync, emptyDirSync } = require('fs-extra');
const { globSync } = require('glob');
const { resolve, join } = require('path');
const { Helper, StepHelper, Counter } = require('./libs/helpers');

function createEmbeddingAsFile(ext, data) {
  const decodedData = Buffer.from(data, 'base64');
  const fileName = `${Helper.generateRandomNumber()}.${ext}`;
  outputFileSync(resolve('html/embeddings', fileName), decodedData);

  return fileName;
}

function generateRdomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Your EJS template
emptyDirSync(resolve('html/embeddings'));

const embeddings = readJsonSync('embeding.json')
  .map(emb => {
    let fileName = '';

    switch (emb.mime_type) {
      case 'image/png': {
        fileName = createEmbeddingAsFile('png', emb.data);
        break;
      }

      case 'image/gif': {
        fileName = createEmbeddingAsFile('gif', emb.data);
        break;
      }

      case 'image/bmp': {
        fileName = createEmbeddingAsFile('bmp', emb.data);
        break;
      }

      case 'image/jpeg': {
        fileName = createEmbeddingAsFile('jpeg', emb.data);
        break;
      }

      case 'image/svg+xml': {
        fileName = createEmbeddingAsFile('svg', emb.data);
        break;
      }

      case 'text/xml': {
        fileName = createEmbeddingAsFile('xml', emb.data);
        break;
      }

      case 'text/plain': {
        fileName = createEmbeddingAsFile('txt', emb.data);
        break;
      }

      case 'text/html': {
        fileName = createEmbeddingAsFile('html', emb.data);
        break;
      }

      case 'text/csv': {
        fileName = createEmbeddingAsFile('csv', emb.data);
        break;
      }

      case 'application/json': {
        fileName = createEmbeddingAsFile('json', emb.data);
        break;
      }

      case 'image/url': {
        break;
      }

      case 'video/mp4': {
        fileName = createEmbeddingAsFile('mp4', emb.data);
        break;
      }

      default: {
        break;
      }
    };

    return {
      getMimeType() {
        return emb.mime_type;
      },
      getName() {
        return emb.name;
      },
      getFileName() {
        return fileName;
      },
      getDecodedData() {
        return Buffer.from(emb.data, 'base64').toString('utf8');
      }
    };
  });


function reportOverviewInstance(num) {
  return {
    getReportFileName() {
      return `ATS_0${num}_Onb_Jghhgr.feature.html`;
    },
    getName() {
      return `ATS_0${num}_Onb_Jghhgr.feature`;
    },
    getQualifier() {
      return 1 * num;
    },
    getPassedSteps() {
      return 3 * num;
    },
    getFailedSteps() {
      return 2 * num;
    },
    getSkippedSteps() {
      return 5 * num;
    },
    getPendingSteps() {
      return 2 * num;
    },
    getUndefinedSteps() {
      return 7 * num;
    },
    getSteps() {
      return 2 * num;
    },
    getPassedScenarios() {
      return 1 * num;
    },
    getFailedScenarios() {
      return 6 * num;
    },
    getScenarios() {
      return 0 * num;
    },
    getDuration() {
      return 22.654 * num;
    },
    getFormattedDuration() {
      return 22.564 * num;
    },
    getStatus() {
      return {
        getRawName() {
          return num % 2 === 0 ? `PASSED` : `FAILED`;
        },
        getLabel() {
          return num % 2 === 0 ? `Passed` : `Failed`;
        }
      };
    },
  };
}

function reportStepsInstance(num) {
  return {
    getLocation() {
      return 23 * num;
    },
    getTotalOccurrences() {
      return 18 * num;
    },
    getFormattedAverageDuration() {
      return Helper.formatDuration(this.getAverageDuration());
    },
    getFormattedMaxDuration() {
      return Helper.formatDuration(35 * num * 1000);
    },
    getFormattedTotalDuration() {
      return Helper.formatDuration(50 * num * 1000);
    },
    getPercentageResult() {
      return generateRdomNumberBetween(0, 100);
    },
    getAverageDuration() {
      return 25 * num * 1000;
    },
    getDuration() {
      return 25 * num * 1000;
    },
    getStatus() {
      return {
        getRawName() {
          return num % 2 === 0 ? `PASSED` : `FAILED`;
        },
        getLabel() {
          return num % 2 === 0 ? `Passed` : `Failed`;
        }
      };
    },
  };
}


const tagNames = [
  '@Regression_Onboarding',
  '@Regression_SegOnboarding',
  '@Regression_MC',
  '@Regression_Demo',
  '@Sanity',
  '@Suite',
  '@Standalone',
];

function reportOverviewTagsInstance(num) {
  const selectedTag = tagNames[num];

  return {
    getReportFileName() {
      return `${Helper.toValidFileName(selectedTag)}.html`;
    },
    getName() {
      return selectedTag;
    },
    getQualifier() {
      return 1 * num;
    },
    getPassedSteps() {
      return 3 * num;
    },
    getFailedSteps() {
      return 2 * num;
    },
    getSkippedSteps() {
      return 5 * num;
    },
    getPendingSteps() {
      return 2 * num;
    },
    getUndefinedSteps() {
      return 7 * num;
    },
    getSteps() {
      return 2 * num;
    },
    getPassedScenarios() {
      return 1 * num;
    },
    getFailedScenarios() {
      return 6 * num;
    },
    getScenarios() {
      return 0 * num;
    },
    getDuration() {
      return 22.654 * num;
    },
    getFormattedDuration() {
      return 22.564 * num;
    },
    getStatus() {
      return {
        getRawName() {
          return num % 2 === 0 ? `PASSED` : `FAILED`;
        },
        getLabel() {
          return num % 2 === 0 ? `Passed` : `Failed`;
        }
      };
    },
  };
}

function reportOutputInstance(num) {
  return {
    getMessages() {
      return ['Message 1', 'Message 2'];
    }
  };
}

const outputs = [];

for (let i = 0; i < 3; i++) {
  outputs.push(reportOutputInstance(i));
}

function reportHookInstance(name, num) {
  return {
    getResult() {
      return {
        getStatus() {
          return {
            isPassed() {
              return num % 2 === 0;
            },
            getRawName() {
              return num % 2 === 0 ? `PASSED` : `FAILED`;
            }
          };
        },
        getFormattedDuration() {
          return 22.564 * num;
        },
        getErrorMessage() {
          return `Error Message ${name} - ${num}`;
        }
      };
    },
    getMatch() {
      return {
        getLocation() {
          return 29;
        },
      };
    },
    getOutputs() {
      return outputs;
    },
    getEmbeddings() {
      return embeddings.slice(0, 2);
    }
  };
}

const beforeHook = [];
const afterHook = [];

for (let i = 0; i < 10; i++) {
  beforeHook.push(reportHookInstance('Before', i));
  afterHook.push(reportHookInstance('After', i));
}

function reportFailureInstance(num) {
  return {
    getFeature() {
      return {
        getReportFileName() {
          return `ATS_0${num}_Onb_Jghhgr.feature.html`;
        },
        getName() {
          return `ATS_0${num}_Onb_Jghhgr.feature`;
        }
      };
    },
    getStatus() {
      return {
        isPassed() {
          return num % 2 === 0;
        },
        getRawName() {
          return num % 2 === 0 ? `PASSED` : `FAILED`;
        }
      };
    },
    getKeyword() {
      return `Given `;
    },
    getName() {
      return `ATS_0${num}_Onb_Jghhgr Scenario`;
    },
    getBefore() {
      return beforeHook;
    },
    getBeforeStatus() {
      return {
        isPassed() {
          return num % 2 === 0;
        },
        getRawName() {
          return num % 2 === 0 ? `PASSED` : `FAILED`;
        }
      };
    },
    getAfter() {
      return afterHook;
    },
    getAfterStatus() {
      return {
        isPassed() {
          return num % 2 === 0;
        },
        getRawName() {
          return num % 2 === 0 ? `PASSED` : `FAILED`;
        }
      };
    },
    getDescription() {
      return `Description ${num}`;
    },
    getFormattedDuration() {
      return 22.564 * num;
    },
    getSteps() {
      return [
        {
          getComments() {
            return ['Comment 1'];
          },
          getRows() {
            return [
              {
                getCells() {
                  return ['Cell 1', 'Cell 2'];
                }
              }
            ];
          },
          getResult() {
            return {
              getStatus() {
                return {
                  isPassed() {
                    return num % 2 === 0;
                  },
                  getRawName() {
                    return num % 2 === 0 ? `PASSED` : `FAILED`;
                  }
                };
              },
              getErrorMessageTitle() {
                return 'Error Message Title';
              },
              getErrorMessage() {
                return `Error Message ${num}`;
              },
              getFormattedDuration() {
                return `25.32`;
              }
            };
          },
          getBefore() {
            return beforeHook;
          },
          getBeforeStatus() {
            return {
              isPassed() {
                return num % 2 === 0;
              },
              getRawName() {
                return num % 2 === 0 ? `PASSED` : `FAILED`;
              }
            };
          },
          getAfter() {
            return afterHook;
          },
          getAfterStatus() {
            return {
              isPassed() {
                return num % 2 === 0;
              },
              getRawName() {
                return num % 2 === 0 ? `PASSED` : `FAILED`;
              }
            };
          },
          getOutputs() {
            return outputs;
          },
          getEmbeddings() {
            return embeddings.slice(0, 2);
          },
          getMatch() {
            return {
              getArguments() {
                return [];
              }
            };
          },
          getName() {
            return 'Keyword';
          },
          getName() {
            return 'Step Name';
          },
          getKeyword() {
            return 'Keyword';
          },
          getDocString() {
            return {
              getValue() {
                return 'Doc String';
              }
            };
          }
        }
      ];
    },
    getStepsStatus() {
      return {
        getRawName() {
          return ['Comment 1'];
        },
      };
    },
    getTags() {
      return [
        {
          getFileName() {
            return `ATS_0${num}_Onb_Jghhgr.tag.html`;
          },
          getName() {
            return `@Regression_Onboarding`;
          }
        }
      ];
    }
  };
}

const all_features = Array(10).fill({}).map((_, i) => reportOverviewInstance(i));
const failures = Array(10).fill({}).map((_, i) => reportFailureInstance(i));
const all_tags = tagNames.map((_, i) => reportOverviewTagsInstance(i));
const all_steps = Array(50).fill({}).map((_, i) => reportStepsInstance(i));

// Data to be passed to the template
const data = {
  build_number: '177',
  run_with_jenkins: true,
  build_previous_number: '176',
  report_file: 'overview.html',
  trends_available: true,
  all_features,
  all_tags,
  all_steps,
  feature: {
    // getReportFileName() {
    //   return `ATS_0${num}_Onb_Jghhgr.feature.html`;
    // },
    getName() {
      return `ATS_01_Onb_Jghhgr.feature`;
    },
    getTags() {
      return [
        {
          getFileName() {
            return `ATS_01_Onb_Jghhgr.tag.html`;
          },
          getName() {
            return `@Regression_Onboarding`;
          }
        }
      ];
    },
    getDescription() {
      return `Description 1`;
    },
    getElements() {
      return [
        {
          getTags() {
            return [
              {
                getFileName() {
                  return `ATS_01_Onb_Jghhgr.tag.html`;
                },
                getName() {
                  return `@Regression_Onboarding`;
                }
              }
            ];
          },
          getFormattedDuration() {
            return Helper.formatDuration(125468 * 1000);
          },
          getStatus() {
            return {
              getRawName() {
                return `PASSED`;
              },
              getLabel() {
                return `Passed`;
              },
              isPassed() {
                return true;
              }
            };
          },
          getKeyword() {
            return `Given `;
          },
          getName() {
            return `Step Name`;
          },
          getDescription() {
            return 'Description';
          },
          getBefore() {
            return beforeHook;
          },
          getBeforeStatus() {
            return {
              isPassed() {
                return num % 2 === 0;
              },
              getRawName() {
                return num % 2 === 0 ? `PASSED` : `FAILED`;
              }
            };
          },
          getAfter() {
            return afterHook;
          },
          getAfterStatus() {
            return {
              isPassed() {
                return num % 2 === 0;
              },
              getRawName() {
                return num % 2 === 0 ? `PASSED` : `FAILED`;
              }
            };
          },
          getSteps() {
            return [];
          },
          getStepsStatus() {
            return {
              getRawName() {
                return ['Comment 1'];
              },
            };
          },
        }
      ];
    },
    getKeyword() {
      return `Given `;
    },
    // getQualifier() {
    //   return 1 * num;
    // },
    // getPassedSteps() {
    //   return 3 * num;
    // },
    // getFailedSteps() {
    //   return 2 * num;
    // },
    // getSkippedSteps() {
    //   return 5 * num;
    // },
    // getPendingSteps() {
    //   return 2 * num;
    // },
    // getUndefinedSteps() {
    //   return 7 * num;
    // },
    // getSteps() {
    //   return 2 * num;
    // },
    // getPassedScenarios() {
    //   return 1 * num;
    // },
    // getFailedScenarios() {
    //   return 6 * num;
    // },
    // getScenarios() {
    //   return 0 * num;
    // },
    // getDuration() {
    //   return 22.654 * num;
    // },
    // getFormattedDuration() {
    //   return 22.564 * num;
    // },
    getStatus() {
      return {
        getRawName() {
          return `PASSED`;
        },
        getLabel() {
          return `Passed`;
        }
      };
    },
  },
  report_summary: {
    getPassedSteps() {
      return 1;
    },
    getFailedSteps() {
      return 1;
    },
    getSkippedSteps() {
      return 1;
    },
    getPendingSteps() {
      return 1;
    },
    getUndefinedSteps() {
      return 1;
    },
    getSteps() {
      return 1;
    },
    getPassedScenarios() {
      return 1;
    },
    getFailedScenarios() {
      return 1;
    },
    getScenarios() {
      return 1;
    },
    getFormattedDuration() {
      return 2500;
    },
    getPassedFeatures() {
      return 1;
    },
    getFeatures() {
      return 1;
    },
    getFailedFeatures() {
      return 5;
    }
  },
  Helper,
  stepNameFormatter: StepHelper,
  counter: new Counter(),
  js_files: [],
  css_files: [],
  build_project_name: 'BOSCOS',
  build_time: '2023-05-05 10:08 PM',
  classifications: [],
  table_key: 'feature',
  parallel_testing: false,
  failures,
  expand_all_steps: false,
  hide_empty_hooks: true,
  result: {
    getFormattedDuration() {
      return `22.56`;
    }
  },
  chart_categories: tagNames,
  chart_data: [
    [100, 100, 99.06, 100, 100, 99.06, 97.37, 100, 100],
    [0, 0, 0.14, 0, 0, 0, 0, 0.14, 1.32, 0, 0],
    [0, 0, 0.8, 0, 0, 0, 0, 0.8, 1.32, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, , 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, , 0]
  ],
  all_occurrences: 55,
  all_average_duration: 22,
  all_max_duration: 35,
  all_durations: 225,
  failedFeatures: 12,
  passedFeatures: 30,
  failedScenarios: 56,
  passedScenarios: 85,
  passedSteps: 1026,
  failedSteps: 56,
  skippedSteps: 2509,
  pendingSteps: 0,
  undefinedSteps: 0,
  durations: 352902 * 1000,
  reportable: {
    getName() {
      return 'Name';
    },
    getPassedSteps() {
      return 250;
    },
    getFailedSteps() {
      return 50;
    },
    getSkippedSteps() {
      return 1250;
    },
    getPendingSteps() {
      return 0;
    },
    getUndefinedSteps() {
      return 0;
    },
    getSteps() {
      return 350;
    },
    getPassedScenarios() {
      return 255;
    },
    getFailedScenarios() {
      return 25;
    },
    getScenarios() {
      return 300;
    },
    getDuration() {
      return 125468 * 1000;
    },
    getFormattedDuration() {
      return Helper.formatDuration(125468 * 1000);
    },
    getStatus() {
      return {
        getRawName() {
          return `PASSED`;
        },
        getLabel() {
          return `Passed`;
        }
      };
    },
  }
};

const templateRoot = resolve(`resources/templates`);
const genTemplateRoot = join(templateRoot, 'generators');
globSync('*.ejs', { cwd: genTemplateRoot })
  .forEach(templateFile => {
    const template = readFileSync(join(genTemplateRoot, templateFile), 'utf8');
    // Compile the template and get the rendered HTML as a string
    const html = render(template, data, {
      root: [
        templateRoot
      ]
    });

    const htmlFile = templateFile.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '').replace(/.ejs$/, '.html');

    outputFileSync(resolve('html', htmlFile), html);
  });
