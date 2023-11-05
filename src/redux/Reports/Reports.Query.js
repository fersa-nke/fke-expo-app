import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("mydb.db");


export const createReportTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
  'CREATE TABLE IF NOT EXISTS reports ('
    + 'Id INTEGER PRIMARY KEY AUTOINCREMENT,'
    + 'BearingHousingDEMax TEXT,'
    + 'BearingHousingDEMin TEXT,'
    + 'BearingHousingNDEMax TEXT,'
    + 'BearingHousingNDEMin TEXT,'
    + 'CreatedAt TEXT,'
    + 'Comments TEXT,'
    + 'InsulateResistance TEXT,'
    + 'Job TEXT,'
    + 'JobId INTEGER,'
    + 'LastLubrication TEXT,'
    + 'LubricationGrade TEXT,'
    + 'LubricationType TEXT,'
    + 'Name TEXT,'
    + 'NOKBearing TEXT,'
    + 'ReportDate TEXT,'
    + 'ReportId TEXT,'
    + 'SerialNumber TEXT,'
    + 'ShaftJournalDEMax TEXT,'
    + 'ShaftJournalDEMin TEXT,'
    + 'ShaftJournalNDEMax TEXT,'
    + 'ShaftJournalNDEMin TEXT,'
    + 'UpdatedAt TEXT,'
    + 'VoltageTested TEXT,'
    + 'isSync INTEGER'
    + ');',
  [],
  () => {
    console.log('Table created successfully.');
  },
  (_, error) => {
    console.error('Error creating table:', error);
  }
);

  });
};


export const insertReportTable = (res) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO reports ('
        + 'BearingHousingDEMax,'
        + 'BearingHousingDEMin,'
        + 'BearingHousingNDEMax,'
        + 'BearingHousingNDEMin,'
        + 'Comments,'
        + 'CreatedAt,'
        + 'InsulateResistance,'
        + 'JobId,'
        + 'Job,'
        + 'LastLubrication,'
        + 'LubricationGrade,'
        + 'LubricationType,'
        + 'NOKBearing,'
        + 'Name,'
        + 'ReportDate,'
        + 'ReportId,'
        + 'SerialNumber,'
        + 'ShaftJournalDEMax,'
        + 'ShaftJournalDEMin,'
        + 'ShaftJournalNDEMax,'
        + 'ShaftJournalNDEMin,'
        + 'UpdatedAt,'
        + 'VoltageTested,'
        + 'isSync'
        + ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
      [
        res.BearingHousingDEMax,
        res.BearingHousingDEMin,
        res.BearingHousingNDEMax,
        res.BearingHousingNDEMin,
        res.Comments,
        new Date().toString(),
        res.InsulateResistance,
        res.JobId,
        JSON.stringify(res.Job),
        res.LastLubrication,
        JSON.stringify(res.LubricationGrade),
        JSON.stringify(res.LubricationType),
        res.NOKBearing,
        res.Name,
        res.ReportDate,
        res.ReportId,
        res.SerialNumber,
        res.ShaftJournalDEMax,
        res.ShaftJournalDEMin,
        res.ShaftJournalNDEMax,
        res.ShaftJournalNDEMin,
        new Date().toString(),
        res.VoltageTested,
        res.isSync
      ],
      (_, results) => {
        // Check results for success or error
        if (results.rowsAffected > 0) {
          console.log('res inserted successfully.');
        } else {
          console.error('Error inserting res.');
        }
      },
      (_, error) => {
        console.error('Error executing SQL query:', error);
      }
    );
  });
};

export const updateReportTable = (res) => {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE reports SET '
        + 'BearingHousingDEMax=?, '
        + 'BearingHousingDEMin=?, '
        + 'BearingHousingNDEMax=?, '
        + 'BearingHousingNDEMin=?, '
        + 'Comments=?, '
        + 'InsulateResistance=?, '
        + 'Job=?, '
        + 'JobId=?, '
        + 'LastLubrication=?, '
        + 'LubricationGrade=?, '
        + 'LubricationType=?, '
        + 'Name=?, '
        + 'NOKBearing=?, '
        + 'ReportDate=?, '
        + 'ReportId=?, '
        + 'SerialNumber=?, '
        + 'ShaftJournalDEMax=?, '
        + 'ShaftJournalDEMin=?, '
        + 'ShaftJournalNDEMax=?, '
        + 'ShaftJournalNDEMin=?, '
        + 'UpdatedAt=?, '
        + 'VoltageTested=?,'
        + 'isSync=?'
        + 'WHERE Id=?',
      [
        res.BearingHousingDEMax,
        res.BearingHousingDEMin,
        res.BearingHousingNDEMax,
        res.BearingHousingNDEMin,
        res.Comments,
        res.InsulateResistance,
        JSON.stringify(res.Job),
        res.JobId,
        res.LastLubrication,
        JSON.stringify(res.LubricationGrade),
        JSON.stringify(res.LubricationType),
        res.Name,
        res.NOKBearing,
        res.ReportDate,
        res.ReportId,
        res.SerialNumber,
        res.ShaftJournalDEMax,
        res.ShaftJournalDEMin,
        res.ShaftJournalNDEMax,
        res.ShaftJournalNDEMin,
        res.UpdatedAt,
        res.VoltageTested,
        res.isSync,
        res.Id, // The Id of the record to update
      ],
      (_, results) => {
        // Check results for success or error
        if (results.rowsAffected > 0) {
          console.log('report table updated successfully.');
        } else {
          console.error('Error updating report');
        }
      },
      (_, error) => {
        console.error('Error executing SQL query:', error);
      }
    );
  });
};

export const deleteReportTableUsingID = (idToDelete) => {
  db.transaction((tx) => {
  tx.executeSql(
    'DELETE FROM reports WHERE Id = ?;',
    [idToDelete], // Replace 'idToDelete' with the actual Id value you want to delete
    (_, results) => {
      // Check results for success or error
      if (results.rowsAffected > 0) {
        console.log('Record deleted successfully.');
      } else {
        console.error('No records were deleted.');
      }
    },
    (_, error) => {
      console.error('Error executing SQL query:', error);
    }
  );
});

}




export const getAllReports = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM reports",
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

export const truncateReportDataTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM reports",
      [],
      (_, result) => {
        console.log("reports truncated successfully.");
      },
      (_, error) => {
        console.error("Error truncating table: ", error);
      }
    );
  });
};