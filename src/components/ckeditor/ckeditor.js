import React from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./ckeditor.css";
import proptype from "prop-types";

function Ckeditor(props) {
  return (
    <div className="cke-main">
      <CKEditor
        editor={ClassicEditor}
        data={props.value}
        onInit={editor => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          if (props.onChange) {
            props.onChange(data);
          }
        }}
        onBlur={(event, editor) => {
          if (props.onBlur) {
            props.onBlur(event);
          }
        }}
        onFocus={(event, editor) => {
          if (props.onFocus) {
            props.onFocus(event);
          }
        }}
      />
    </div>
  );
}

Ckeditor.propTypes = {
  value: proptype.any,
  onChange: proptype.func.isRequired,
  onBlur: proptype.func,
  onFocus: proptype.func
};

export default Ckeditor;
