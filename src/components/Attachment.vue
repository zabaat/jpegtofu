<template>
    <div>
        <vue-dropzone
            ref="myVueDropzone"
            :use-custom-slot="true"
            id="dropzone"
            @vdropzone-upload-progress="uploadProgress"
            :options="dropzoneOptions"
            @vdropzone-files-added="filesAdded"
            @vdropzone-sending-multiple="sendingFiles"
            @vdropzone-success-multiple="success"
        ></vue-dropzone>
        <attachment-list />
    </div>
</template>

<style></style>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import attachmentList from '../components/AttachmentList'
import squishFiles from './imageprocess.js'

export default {
    name: 'PageIndex',
    components: { vueDropzone: vue2Dropzone, attachmentList },
    data() {
        return {
            tempAttachments: [],
            attachments: [],
            dropzoneOptions: {
                url: `the server url, where you want your filesto be sent`,
                maxFilesize: 50,
                headers: {
                    Authorization: `<your application access-token>`,
                },
                // eslint-disable-next-line
                paramName: n => {
                    return 'file[]'
                },
                dictDefaultMessage: 'Upload Files Here xD',
                includeStyling: false,
                previewsContainer: false,
                thumbnailWidth: 250,
                thumbnailHeight: 140,
                uploadMultiple: true,
                parallelUploads: 20,
                // eslint-disable-next-line
                accept(file, done) {
                    const reader = new FileReader()
                    reader.addEventListener('loaded', event => {
                        console.log('RESULT OF FILE TARGET', event.target.result)
                        debugger
                    })
                    console.log('file reader read!!')
                    reader.readAsText(file)
                },
            },
        }
    },
    mounted() {},
    methods: {
        // function called for every file dropped or selected
        filesAdded(files) {
            console.log('Files Dropped => ', files)
            files.map(f => {
                const attachment = {}
                // eslint-disable-next-line
                // attachment._id = file.upload.uuid
                attachment.title = f.name
                attachment.type = 'file'
                attachment.path = f.path
                // eslint-disable-next-line
                attachment.extension = '.' + f.type.split('/')[1]
                attachment.user = JSON.parse(localStorage.getItem('user'))
                attachment.content = 'File Upload by Select or Drop'
                attachment.thumb = f.dataURL
                attachment.thumb_list = f.dataURL
                attachment.isLoading = true
                attachment.progress = null
                attachment.size = f.size
                this.tempAttachments = [...this.tempAttachments, attachment]
                const x = squishFiles
                console.log(x)
                debugger
                squishFiles(f.path)
                return f
            })
        },
        // a middle layer function where you can change the XHR request properties
        // eslint-disable-next-line
        sendingFiles(files, xhr, formData) {
            console.log('if you want to change the upload time or add data to the formData you can do it here.')
            console.log('Files sending', files)
        },
        // function where we get the upload progress
        // eslint-disable-next-line
        uploadProgress(file, progress, bytesSent) {
            console.log('File Upload Progress', progress)
            // eslint-disable-next-line
            this.tempAttachments.map(attachment => {
                if (attachment.title === file.name) {
                    attachment.progress = `${Math.floor(progress)}`
                }
            })
        },
        // called on successful upload of a file
        success(file, response) {
            console.log('File uploaded successfully')
            console.log('Response is ->', response)
        },
    },
    computed: {
        getTempAttachments() {
            return this.tempAttachments
        },
        getAttachments() {
            return this.attachments
        },
    },
}
</script>
