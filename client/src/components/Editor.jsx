import React from "react";
import { useState } from "react";
import TextEditor from "react-simple-wysiwyg";
import { Card } from "./ui/card";
const Editor = () => {
  const [html, setHtml] = useState("my <b>HTML</b>");

  function onChange(e) {
    setHtml(e.target.value);
    //console.log(html);
  }

  return (
    <>
      <Card>
        <TextEditor value={html} onChange={onChange} />
      </Card>
    </>
  );
};

export default Editor;
