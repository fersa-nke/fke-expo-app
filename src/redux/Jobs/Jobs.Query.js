import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("mydb.db");

export const createPageInfoQuery = async () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS pageinfo (
          isFirstPage BOOLEAN, 
          isLastPage BOOLEAN, 
          offSet INTEGER, 
          page INTEGER, 
          pageSize INTEGER, 
          totalRows INTEGER PRIMARY KEY
        )`,
      [],
      () => {
        console.log('Table "pageInfo" created successfully');
      },
      (error) => {
        console.error("Error creating table:", error);
      }
    );
  });
};

export const insertPageInfo = async (res) => {
  const { isFirstPage, isLastPage, offSet, page, pageSize, totalRows } = res;
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT OR IGNORE INTO pageinfo (isFirstPage, isLastPage, offSet, page, pageSize, totalRows) VALUES (?, ?, ?, ?, ?, ?)",
      [isFirstPage, isLastPage, offSet, page, pageSize, totalRows],
      () => {
        console.log("Data inserted successfully");
      },
      (error) => {
        console.error("Error inserting data:", error);
      }
    );
  });
};

export const getPageInfo = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM pageinfo",
        [],
        (_, result) => {
          const rows = result.rows._array; // Convert the result to an array of objects
          resolve(rows);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const createOrCheckTable = async () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS jobs (
                    Id INTEGER PRIMARY KEY,
                    JobId TEXT,
                    CreatedAt TEXT,
                    UpdatedAt TEXT,
                    JobDate TEXT,
                    WindTurbine TEXT,
                    Comments TEXT,
                    OperatorId TEXT,
                    OperatorName TEXT,
                    CustomerId TEXT,
                    FailureDate TEXT,
                    DEDataMatrix TEXT,
                    NDEDataMatrix TEXT,
                    DEBatchNumber TEXT,
                    NDEBatchNumber TEXT,
                    SensorBatchNumber TEXT,
                    SensorNDEDataMatrix TEXT,
                    RemovedDEDataMatrix TEXT,
                    RemovedNDEDataMatrix TEXT,
                    RemovedDEBatchNumber TEXT,
                    RemovedNDEBatchNumber TEXT,
                    ExchangeType TEXT,
                    ReasonType TEXT,
                    NewBearingBrand TEXT,
                    NewBearingType TEXT,
                    GeneratorModel TEXT,
                    BearingModel TEXT,
                    CustomerWindFarm TEXT,
                    ShaftPosition TEXT,
                    RemovedBearingBrand TEXT,
                    RemovedBearingType TEXT,
                    CustomerWindLocation TEXT,
                    ReportsList TEXT,
                    Customer TEXT,
                    State TEXT,
                    isSync INTEGER
                )`,
      [],
      () => {
        console.log('Table "jobs" created successfully');
      },
      (error) => {
        console.error("Error creating table:", error);
      }
    );
  });
};

export const insertDataToTable = async (res, isSync = 0) => {
  res?.list.forEach((jsonObject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT OR IGNORE INTO jobs (Id, JobId, CreatedAt, UpdatedAt, JobDate, WindTurbine, Comments, OperatorId, OperatorName, CustomerId, FailureDate, DEDataMatrix, NDEDataMatrix, DEBatchNumber, NDEBatchNumber, SensorBatchNumber, SensorNDEDataMatrix, RemovedDEDataMatrix, RemovedNDEDataMatrix, RemovedDEBatchNumber, RemovedNDEBatchNumber, ExchangeType, ReasonType, NewBearingBrand, NewBearingType, GeneratorModel, BearingModel, CustomerWindFarm, ShaftPosition, RemovedBearingBrand, RemovedBearingType, CustomerWindLocation, ReportsList, Customer, State, isSync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?)`,
        [
          jsonObject.Id,
          jsonObject.JobId,
          jsonObject.CreatedAt,
          jsonObject.UpdatedAt,
          jsonObject.JobDate,
          jsonObject.WindTurbine,
          jsonObject.Comments,
          jsonObject.OperatorId,
          jsonObject.OperatorName,
          jsonObject.CustomerId,
          jsonObject.FailureDate,
          jsonObject.DEDataMatrix,
          jsonObject.NDEDataMatrix,
          jsonObject.DEBatchNumber,
          jsonObject.NDEBatchNumber,
          jsonObject.SensorBatchNumber,
          jsonObject.SensorNDEDataMatrix,
          jsonObject.RemovedDEDataMatrix,
          jsonObject.RemovedNDEDataMatrix,
          jsonObject.RemovedDEBatchNumber,
          jsonObject.RemovedNDEBatchNumber,
          JSON.stringify(jsonObject.ExchangeType),
          JSON.stringify(jsonObject.ReasonType),
          JSON.stringify(jsonObject.NewBearingBrand),
          JSON.stringify(jsonObject.NewBearingType),
          JSON.stringify(jsonObject.GeneratorModel),
          JSON.stringify(jsonObject.BearingModel),
          JSON.stringify(jsonObject.CustomerWindFarm),
          JSON.stringify(jsonObject.ShaftPosition),
          JSON.stringify(jsonObject.RemovedBearingBrand),
          JSON.stringify(jsonObject.RemovedBearingType),
          JSON.stringify(jsonObject.CustomerWindLocation),
          JSON.stringify(jsonObject.ReportsList),
          JSON.stringify(jsonObject.Customer),
          JSON.stringify(jsonObject.State),
          isSync,
        ],
        () => {
          console.log("row inserted successfully");
        },
        (error) => {
          console.error("table is already exist", error);
        }
      );
    });
  });
};

export const updateDataInTable = async (res) => {
  res?.list.forEach((updatedData) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE jobs
        SET
          UpdatedAt = ?,
          JobDate = ?,
          WindTurbine = ?,
          Comments = ?,
          OperatorId = ?,
          OperatorName = ?,
          CustomerId = ?,
          FailureDate = ?,
          DEDataMatrix = ?,
          NDEDataMatrix = ?,
          DEBatchNumber = ?,
          NDEBatchNumber = ?,
          SensorBatchNumber = ?,
          SensorNDEDataMatrix = ?,
          RemovedDEDataMatrix = ?,
          RemovedNDEDataMatrix = ?,
          RemovedDEBatchNumber = ?,
          RemovedNDEBatchNumber = ?,
          ExchangeType = ?,
          ReasonType = ?,
          NewBearingBrand = ?,
          NewBearingType = ?,
          GeneratorModel = ?,
          BearingModel = ?,
          CustomerWindFarm = ?,
          ShaftPosition = ?,
          RemovedBearingBrand = ?,
          RemovedBearingType = ?,
          CustomerWindLocation = ?,
          ReportsList = ?,
          Customer = ?,
          State = ?,
          isSync = ?
        WHERE JobID = ?`,
        [
          updatedData.UpdatedAt,
          updatedData.JobDate,
          updatedData.WindTurbine,
          updatedData.Comments,
          updatedData.OperatorId,
          updatedData.OperatorName,
          updatedData.CustomerId,
          updatedData.FailureDate,
          updatedData.DEDataMatrix,
          updatedData.NDEDataMatrix,
          updatedData.DEBatchNumber,
          updatedData.NDEBatchNumber,
          updatedData.SensorBatchNumber,
          updatedData.SensorNDEDataMatrix,
          updatedData.RemovedDEDataMatrix,
          updatedData.RemovedNDEDataMatrix,
          updatedData.RemovedDEBatchNumber,
          updatedData.RemovedNDEBatchNumber,
          JSON.stringify(updatedData.ExchangeType),
          JSON.stringify(updatedData.ReasonType),
          JSON.stringify(updatedData.NewBearingBrand),
          JSON.stringify(updatedData.NewBearingType),
          JSON.stringify(updatedData.GeneratorModel),
          JSON.stringify(updatedData.BearingModel),
          JSON.stringify(updatedData.CustomerWindFarm),
          JSON.stringify(updatedData.ShaftPosition),
          JSON.stringify(updatedData.RemovedBearingBrand),
          JSON.stringify(updatedData.RemovedBearingType),
          JSON.stringify(updatedData.CustomerWindLocation),
          JSON.stringify(updatedData.ReportsList),
          JSON.stringify(updatedData.Customer),
          JSON.stringify(updatedData.State),
          updatedData.isSync,
          updatedData.JobId, // Specify the condition value here
        ],
        (_, results) => {
          console.log("Update successful");
        },
        (error) => {
          console.error("Error updating record:", error);
        }
      );
    });
  });
};

export const getAllJobs = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM jobs ORDER BY Id DESC",
        [],
        (_, result) => {
          const rows = result.rows._array; // Convert the result to an array of objects
          resolve(rows);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const checkIfFormDataPresent = (jobId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM formDataTable WHERE JobId = '" + jobId + "'",
        [],
        (_, result) => {
          const rows = result.rows._array; // Convert the result to an array of objects
          resolve(rows);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const truncateJobsDataTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM jobs",
      [],
      (_, result) => {
        console.log("jobs Table truncated successfully.");
      },
      (_, error) => {
        console.error("Error truncating table: ", error);
      }
    );
  });
};

export const createformDataTable = async () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS formDataTable (
          Comments TEXT, 
          Customer INTEGER, 
          CustomerId INTEGER, 
          CustomerWindFarm INTEGER, 
          CustomerWindLocation INTEGER, 
          DEBatchNumber TEXT, 
          DEDataMatrix TEXT, 
          ExchangeType INTEGER, 
          FailureDate TEXT, 
          GeneratorModel INTEGER, 
          JobDate TEXT, 
          JobId TEXT, 
          NDEBatchNumber TEXT, 
          NDEDataMatrix TEXT, 
          NewBearingBrand INTEGER, 
          NewBearingType INTEGER, 
          OperatorId INTEGER, 
          OperatorName TEXT, 
          ReasonType INTEGER, 
          RemovedBearingBrand INTEGER, 
          RemovedBearingType INTEGER, 
          RemovedDEBatchNumber TEXT, 
          RemovedDEDataMatrix TEXT, 
          RemovedNDEBatchNumber TEXT, 
          RemovedNDEDataMatrix TEXT, 
          SensorBatchNumber TEXT, 
          SensorNDEDataMatrix TEXT, 
          ShaftPosition INTEGER, 
          State INTEGER, 
          WindTurbine TEXT
          )`,
      [],
      () => {
        console.log("form Table created successfully.");
      },
      (_, error) => {
        console.error("Error creating table: ", error);
      }
    );
  });
};

export const insertFormDataintoTable = async (data) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT OR IGNORE INTO formDataTable (
          Comments, Customer, CustomerId, CustomerWindFarm, CustomerWindLocation,
          DEBatchNumber, DEDataMatrix, ExchangeType, FailureDate, GeneratorModel,
          JobDate, JobId, NDEBatchNumber, NDEDataMatrix, NewBearingBrand, NewBearingType,
          OperatorId, OperatorName, ReasonType, RemovedBearingBrand, RemovedBearingType,
          RemovedDEBatchNumber, RemovedDEDataMatrix, RemovedNDEBatchNumber, RemovedNDEDataMatrix,
          SensorBatchNumber, SensorNDEDataMatrix, ShaftPosition, State, WindTurbine) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.Comments,
        data.Customer,
        data.CustomerId,
        data.CustomerWindFarm,
        data.CustomerWindLocation,
        data.DEBatchNumber,
        data.DEDataMatrix,
        data.ExchangeType,
        data.FailureDate,
        data.GeneratorModel,
        data.JobDate,
        data.JobId,
        data.NDEBatchNumber,
        data.NDEDataMatrix,
        data.NewBearingBrand,
        data.NewBearingType,
        data.OperatorId,
        data.OperatorName,
        data.ReasonType,
        data.RemovedBearingBrand,
        data.RemovedBearingType,
        data.RemovedDEBatchNumber,
        data.RemovedDEDataMatrix,
        data.RemovedNDEBatchNumber,
        data.RemovedNDEDataMatrix,
        data.SensorBatchNumber,
        data.SensorNDEDataMatrix,
        data.ShaftPosition,
        data.State,
        data.WindTurbine,
      ],
      (_, result) => {
        console.log("form Data inserted successfully. >>>>>>>>>>>>>>>");
      },
      (_, error) => {
        console.error("Error inserting data: ", error);
      }
    );
  });
};

export const updateFormDataintoTable = async (data) => {
  console.log(data, "data");
  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE formDataTable
     SET
       Comments = ?,
       Customer = ?,
       CustomerId = ?,
       CustomerWindFarm = ?,
       CustomerWindLocation = ?,
       DEBatchNumber = ?,
       DEDataMatrix = ?,
       ExchangeType = ?,
       FailureDate = ?,
       GeneratorModel = ?,
       JobDate = ?,
       NDEBatchNumber = ?,
       NDEDataMatrix = ?,
       NewBearingBrand = ?,
       NewBearingType = ?,
       OperatorId = ?,
       OperatorName = ?,
       ReasonType = ?,
       RemovedBearingBrand = ?,
       RemovedBearingType = ?,
       RemovedDEBatchNumber = ?,
       RemovedDEDataMatrix = ?,
       RemovedNDEBatchNumber = ?,
       RemovedNDEDataMatrix = ?,
       SensorBatchNumber = ?,
       SensorNDEDataMatrix = ?,
       ShaftPosition = ?,
       State = ?,
       WindTurbine = ?
     WHERE JobId = ?`,
      [
        data.Comments,
        data.Customer,
        data.CustomerId,
        data.CustomerWindFarm,
        data.CustomerWindLocation,
        data.DEBatchNumber,
        data.DEDataMatrix,
        data.ExchangeType,
        data.FailureDate,
        data.GeneratorModel,
        data.JobDate,
        data.NDEBatchNumber,
        data.NDEDataMatrix,
        data.NewBearingBrand,
        data.NewBearingType,
        data.OperatorId,
        data.OperatorName,
        data.ReasonType,
        data.RemovedBearingBrand,
        data.RemovedBearingType,
        data.RemovedDEBatchNumber,
        data.RemovedDEDataMatrix,
        data.RemovedNDEBatchNumber,
        data.RemovedNDEDataMatrix,
        data.SensorBatchNumber,
        data.SensorNDEDataMatrix,
        data.ShaftPosition,
        data.State,
        data.WindTurbine,
        data.JobId, // Specify the JobId to identify the record you want to update
      ],
      (_, result) => {
        console.log("Form Data updated successfully.");
      },
      (_, error) => {
        console.error("Error updating data: ", error);
      }
    );
  });
};

export const syncAllDataToDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM formDataTable",
        [],
        (_, result) => {
          const rows = result.rows._array; // Convert the result to an array of objects
          console.log(rows, ">>>>>>>>>>>>>>>>>>");
          resolve(rows);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const truncateformDataTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM formDataTable",
      [],
      (_, result) => {
        console.log("Table truncated successfully.");
      },
      (_, error) => {
        console.error("Error truncating table: ", error);
      }
    );
  });
};
