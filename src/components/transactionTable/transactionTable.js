import React from "react";
import "./transactionTable.css";
import proptype from "prop-types";
import { Spinner } from "../spinner/Spinner";

function TransactionTable({ keys, values, loading }) {
  if (!loading) {
    if (!keys || !values) {
      return <div />;
    }
  }
  return (
    <div className="transactionTable">
      <table>
        <thead>
          <tr>
            {keys.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>
        </thead>
        {loading ? (
          <div className="loading">
            <Spinner />
          </div>
        ) : (
          <tbody>
            {values.map((item, index) => (
              <tr key={index}>
                {item.map((content, key) => (
                  <td key={key}>{content}</td>
                ))}
              </tr>
            ))}
            {values.length < 1 && (
              <div className="noData">No data found...</div>
            )}
          </tbody>
        )}
      </table>
    </div>
  );
}

TransactionTable.propType = {
  keys: proptype.array,
  values: proptype.arrayOf(proptype.array)
};

export default TransactionTable;
