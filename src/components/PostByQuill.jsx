import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import { quillFormats, quillModules } from "../consts";
import LoadingGif from "../assets/img/loading.gif";
import useImageUpload from "../hooks copy/useFireStorage";
import { generateFileName, generateUUID } from "../functions";

const PostByQuill = () => {
  const [quillValue, setQuillValue] = useState("");
  const quillRef = useRef(null);
  const uploadDetailImage = useImageUpload("/productDetails/");

  const handleQuillChange = (content, delta, source, editor) => {
    setQuillValue(editor.getContents());
  };

  useEffect(() => {
    const handleImage = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
      input.onchange = async () => {
        const file = input.files[0];
        const newFileName = generateFileName(file.name, generateUUID());
        console.log(file);

        // // 현재 커서 위치 저장
        const range = quillRef?.current.getEditor().getSelection(true);

        // // 서버에 올려질때까지 표시할 로딩 placeholder 삽입
        quillRef?.current
          .getEditor()
          .insertEmbed(range.index, "image", LoadingGif);

        try {
          await uploadDetailImage
            .uploadImage(file, newFileName)
            .then((data) => {
              quillRef?.current.getEditor().deleteText(range.index, 1);
              quillRef?.current
                .getEditor()
                .insertEmbed(range.index, "image", data.downloadUrl);
              quillRef?.current.getEditor().setSelection(range.index + 1);
            });
        } catch (error) {
          console.log(uploadDetailImage.error);
        }
      };
    };

    const handleVideo = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "video/*");
      input.click();
      input.onchange = async () => {
        const file = input.files[0];
        const newFileName = generateFileName(file.name, generateUUID());
        console.log(newFileName);

        // // 현재 커서 위치 저장
        const range = quillRef?.current.getEditor().getSelection(true);

        // // 서버에 올려질때까지 표시할 로딩 placeholder 삽입
        quillRef?.current
          .getEditor()
          .insertEmbed(range.index, "image", LoadingGif);

        try {
          await uploadDetailImage
            .uploadVideo(file, newFileName)
            .then((data) => {
              quillRef?.current.getEditor().deleteText(range.index, 1);
              quillRef?.current
                .getEditor()
                .insertEmbed(range.index, "video", data.downloadUrl, {
                  attribute: { width: "100%" },
                });
              quillRef?.current.getEditor().setSelection(range.index + 1);
            });
        } catch (error) {
          console.log(uploadDetailImage.error);
        }
      };
    };

    if (quillRef.current) {
      const toolbar = quillRef?.current.getEditor().getModule("toolbar");
      toolbar.addHandler("image", handleImage);
      toolbar.addHandler("video", handleVideo);
    }
  }, []);

  useEffect(() => {
    console.log(quillValue);
  }, [quillValue]);

  return (
    <div
      className="flex w-full h-full bg-white justify-center items-start"
      style={{ minHeight: "500px" }}
    >
      <ReactQuill
        style={{ height: "80%" }}
        theme="snow"
        modules={quillModules}
        formats={quillFormats}
        value={quillValue || ""}
        ref={quillRef}
        onChange={handleQuillChange}
      />
    </div>
  );
};

export default PostByQuill;
