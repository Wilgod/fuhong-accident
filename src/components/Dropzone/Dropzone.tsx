import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const getColor = (props) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isDragActive) {
        return '#2196f3';
    }
    return '#eeeeee';
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;



export default function StyledDropzone(props) {
    
    const [files, setFiles] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles
    } = useDropzone({ accept: 'image/*' });

    const uploadedFilesHandler = () => {
        debugger
        for (let item of acceptedFiles) {
            if (item.size / 1024 ** 2 > 3) {
                setErrorMsg("每張相片不多於 3 MB");
                return
            }
        }
        if (files.length + acceptedFiles.length > 5) {
            setErrorMsg("不能上載照片多於5張照片");
        } else {
            setFiles(value => [...value, ...acceptedFiles]);
            setErrorMsg("");
        }
        
    }

    const removeHandler = (index) => {
        setFiles(value => value.filter((f, i) => index !== i));
    }

    useEffect(() => {
        props.selectedFiles(files);
    }, [files]);

    useEffect(() => {
        uploadedFilesHandler();
    }, [acceptedFiles])

    const FilesComponent = files.map((file, index) => {
        return <li key={`${file.name}_${index}`}>
            <div className="d-flex">
                <span className="flex-grow-1 text-break">
                    {file.name} - {file.size / 1024 ** 2} MB
                </span>
                <span style={{ fontSize: 18, fontWeight: 700, cursor: "pointer" }} onClick={() => removeHandler(index)}>
                    &times;
                </span>
            </div>
        </li>
    });

    // const UploadedFilesComponent = Array.isArray(props.uploadedFiles) && props.uploadedFiles.map((file, index) => {
    //     const fileName = file.FileName.substr(file.FileName.indexOf("-") + 1);
    //     return <li key={`${file.FileName}_${index}`}>
    //         <div className="d-flex">
    //             <span className="flex-grow-1 text-break">
    //                 <a href={file.ServerRelativeUrl} target={"_blank"} data-interception="off">{fileName}</a>
    //             </span>
    //             {/* <span style={{ fontSize: 18, fontWeight: 700, cursor: "pointer" }} onClick={() => removeHandler(index)}>
    //                 &times;
    //             </span> */}
    //         </div>
    //     </li>
    // })

    return (
        <div >
            <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
                <input {...getInputProps()} />
                <p>選擇文件或者把文件拖拽到此區域</p>
            </Container>
            {
                files.length > 0 &&
                <aside>
                    <h6>準備上存檔案</h6>
                    <ul>{FilesComponent}</ul>
                </aside>
            }
            <div style={{color:'red'}}>
                {errorMsg}
            </div>
            {/* {
                Array.isArray(props.uploadedFiles) && props.uploadedFiles.length > 0 &&
                <aside >
                    <h6>已上存檔案</h6>
                    <ul>{UploadedFilesComponent}</ul>
                </aside>
            } */}

        </div >
    );
}

