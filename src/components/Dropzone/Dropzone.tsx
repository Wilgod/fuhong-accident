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
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles
    } = useDropzone({ accept: 'image/*' });

    const uploadedFilesHandler = () => {
        setUploadedFiles(value => [...value, ...acceptedFiles]);
    }

    useEffect(() => {
        uploadedFilesHandler();
    }, [acceptedFiles])

    const files = uploadedFiles.map((file, index) => {
        return <li key={`${file.name}_${index}`}>
            <div className="d-flex">
                <span className="flex-grow-1">
                    {file.name} - {file.size / 1024 ** 2} MB
                </span>
                <span style={{ fontSize: 18, fontWeight: 700, cursor: "pointer" }} onClick={() => setUploadedFiles(value => value.filter((f, i) => index !== i))}>
                    &times;
                </span>
            </div>
        </li>
    });

    return (
        <div >
            <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
                <input {...getInputProps()} />
                <p>選擇文件或者把文件拖拽到此區域</p>
            </Container>
            {
                files.length > 0 &&
                <aside>
                    <h6>Files</h6>
                    <ul>{files}</ul>
                </aside>
            }

        </div>
    );
}

