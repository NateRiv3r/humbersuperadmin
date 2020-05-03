import React, { Fragment } from "react";

export function Step({active, step=1, value=""}) {
  let activeStatus = active ? " active " : "";

  return (
    <Fragment>
      <div className="dflex">
        <button className={"outline-btn-primary btn-page-nav" + activeStatus}>
          {step}
        </button>
<<<<<<< US-merging-notification
        <div>
          {value}

        </div>
=======
        <div>{props.value}</div>
>>>>>>> local
      </div>
    </Fragment>
  );
}
