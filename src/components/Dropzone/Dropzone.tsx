import * as React from 'react';
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
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles
    } = useDropzone({ accept: 'image/*' });

    const files = acceptedFiles.map(file => {
        return <li key={file.name}>
            {file.name} - {file.size / 1024 ** 2} MB
        </li>
    });

    return (
        <div >
            <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
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

