import * as React from 'react';  

interface State{
    formats: Array<string>
    videoPath: string, 
    videoExt: string
}
interface Props{
    formats?: Array<string>
    handleUploadChange?: (event: React.ChangeEvent<HTMLInputElement> ) => void
}

export class VideoConvertApp extends React.Component<{}, State> {
    constructor(props:Props) {
        super(props);

        this.handleUploadChange = this.handleUploadChange.bind(this);
        this.state = {
            formats: ['mp4', 'avi', 'mov', 'wmv', 'webm', 'mkv'],
            videoPath: '',
            videoExt: ''
        }
    }
    handleUploadChange(e) {
        const filePathName = e.target.value;
        const fileBaseName = filePathName.replace(/^C:\\fakepath\\/g, "");
        const ext = fileBaseName.match(/([.])\w+/g)[0].replace('.', '');

        this.setState((prevState) => {

            return {
                formats: prevState.formats.filter((format) => format !== ext)
            }
        });

    }
    render() {
        return (
            <div>
                <h1>Convert a Video</h1>
                <VideoFileUpload handleUploadChange={this.handleUploadChange} formats={this.state.formats} />
            </div>
        )
    }
}

class VideoEncoders extends React.Component<Props, State> {

    render() {
        return (
            <div>
                <label>Video Conversion Format: </label>
                <select name="encodeFormat" className="fluid dropdown">
                    {this.props.formats.map((format) => <option key={format} value={format}>{format}</option>)}
                </select>
            </div>
        )
    }
}

class VideoFileUpload extends React.Component<Props, State> {
    render() {
        return (
            <form action="/video/upload" encType="multipart/form-data" method="post" className="ui form">
                <label>Upload Video:</label>
                <input type="file" name="video" accept="video/mp4, video/ogg, video/avi, video/mov, video/wmv, video/webm, video/mkv, video/flv" onChange={this.props.handleUploadChange} />
                <VideoEncoders formats={this.props.formats} />
                <input type="submit" className="ui button" value="Convert"></input>
            </form>
        )
    }
}

