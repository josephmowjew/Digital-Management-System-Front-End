class FileUploadHandler {
    constructor(host) {
        this.host = host;
    }

    handleFileUpload(fileInput, attachments, fieldName) {
        const attachment = attachments.find(attachment => attachment.propertyName === fieldName);


        if (attachment) {

            //console.log("attachment description: ",attachment)
            const fileURL = attachment.filePath.replace(/\\/g, '/');
            const newFileURL = `${host}${fileURL}`;

            // Create a mock file
            const mockFile = new File([""], attachment.propertyName, { type: attachment.fileType });

            // Create a new FileList-like object
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(mockFile);

            // Set the file input's files
            fileInput.files = dataTransfer.files;

            // Create and dispatch a change event
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);

            // Update any related UI elements or perform additional actions
            //console.log(`File ${attachment.fileName} added to input field`);

            // Optionally, you can store the actual file URL as a data attribute
            fileInput.dataset.actualFileUrl = newFileURL;
        }
    }
}
window.FileUploadHandler = FileUploadHandler;