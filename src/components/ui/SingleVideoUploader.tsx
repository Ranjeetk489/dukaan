import React, { useState } from "react";
import { Button } from "./button";

interface Props {
  onUpload: (url: string) => void;
}

const SingleFileUploader: React.FC<Props> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"initial" | "uploading" | "success" | "fail">("initial");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        setStatus("initial");
        setFile(selectedFile);
        setErrorMessage("");
      } else {
        setFile(null);
        setErrorMessage("Please select a image file.");
      }
    }
  };

  const handleUpload = async () => {
    if (file) {
      setStatus("uploading");

      const formData = new FormData();
      formData.append("file", file);

      try {
        //TODO: Upload image and return the url to parent
        const result = await fetch("https://httpbin.org/post", {
          method: "POST",
          body: formData,
        });

        const data = await result.json();

        console.log(data);
        setStatus("success");
        onUpload(data.url); // Pass uploaded URL to parent component
      } catch (error) {
        console.error(error);
        setStatus("fail");
      }
    }
  };

  return (
    <>
      <input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload}>Upload Image</Button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {file && (
        <section>
          File details:
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      )}

      {file && (
        <button
          onClick={handleUpload}
          style={{
            borderRadius: "8px",
            border: "1px solid transparent",
            padding: "0.6em 1.2em",
            fontSize: "1em",
            fontWeight: 500,
            fontFamily: "inherit",
            backgroundColor: "#646cff",
            cursor: "pointer",
            transition: "border-color 0.25s",
            color: "white", // Changed to white for better visibility
          }}
        >
          Upload Image
        </button>
      )}

      <Result status={status} />
      <br />
    </>
  );
};

interface ResultProps {
  status: "initial" | "uploading" | "success" | "fail";
}

const Result: React.FC<ResultProps> = ({ status }) => {
  if (status === "success") {
    return <p>✅ Image uploaded successfully!</p>;
  } else if (status === "fail") {
    return <p>❌ Image upload failed!</p>;
  } else if (status === "uploading") {
    return <p>⏳ Uploading Image...</p>;
  } else {
    return null;
  }
};

export default SingleFileUploader;
