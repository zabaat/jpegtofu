<template>
    <div class="container" style="width:50%; min-width:400px">
        <vue-dropzone
            ref="myVueDropzone"
            :use-custom-slot="true"
            id="dropzone"
            @vdropzone-upload-progress="uploadProgress"
            :options="dropzoneOptions"
            @vdropzone-files-added="filesAdded"
            @vdropzone-sending-multiple="sendingFiles"
            @vdropzone-success-multiple="success"
            @error="fileError"
        >
            <div class="dropzone-container">
                <div class="file-selector">
                    <figure>
                        <svg
                            width="104px"
                            height="104px"
                            viewBox="0 0 104 104"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                        >
                            <defs>
                                <circle id="path-1" cx="36" cy="36" r="36" />
                                <filter x="-37.5%" y="-29.2%" width="175.0%" height="175.0%" filterUnits="objectBoundingBox" id="filter-2">
                                    <feOffset dx="0" dy="6" in="SourceAlpha" result="shadowOffsetOuter1" />
                                    <feGaussianBlur stdDeviation="8" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
                                    <feColorMatrix
                                        values="0 0 0 0 0.0117647059   0 0 0 0 0.0862745098   0 0 0 0 0.160784314  0 0 0 0.08 0"
                                        type="matrix"
                                        in="shadowBlurOuter1"
                                        result="shadowMatrixOuter1"
                                    />
                                    <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter2" />
                                    <feGaussianBlur stdDeviation="1" in="shadowOffsetOuter2" result="shadowBlurOuter2" />
                                    <feColorMatrix
                                        values="0 0 0 0 0.0117647059   0 0 0 0 0.0862745098   0 0 0 0 0.160784314  0 0 0 0.11 0"
                                        type="matrix"
                                        in="shadowBlurOuter2"
                                        result="shadowMatrixOuter2"
                                    />
                                    <feMerge>
                                        <feMergeNode in="shadowMatrixOuter1" />
                                        <feMergeNode in="shadowMatrixOuter2" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="Artboard" transform="translate(-460.000000, -125.000000)">
                                    <g id="Group-4" transform="translate(412.000000, 129.000000)">
                                        <g id="Group-2" transform="translate(58.000000, 0.000000)">
                                            <circle id="Oval" fill="#3560FF" opacity="0.100000001" cx="42" cy="42" r="42" />
                                            <g id="Group" transform="translate(6.000000, 6.000000)">
                                                <g id="Oval">
                                                    <use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1" />
                                                    <use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1" />
                                                </g>
                                                <g
                                                    id="upload-cloud"
                                                    transform="translate(21.818182, 24.000000)"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                >
                                                    <polyline
                                                        id="Path"
                                                        stroke="#000000"
                                                        points="19.6458087 17.3789847 14.3565525 12.0897285 9.06729634 17.3789847"
                                                    />
                                                    <path d="M14.3565525,12.0897285 L14.3565525,24.1794569" id="Path" stroke="#3560FF" />
                                                    <path
                                                        d="M25.6438239,20.7792208 C28.2965835,19.3021499 29.6312816,16.1761528 28.8860265,13.1856562 C28.1407715,10.1951596 25.5052337,8.10125672 22.4838689,8.09921935 L20.8179512,8.09921935 C19.7219904,3.76967373 16.1275086,0.577339516 11.7773112,0.0700384831 C7.42711383,-0.43726255 3.22057026,1.84535014 1.19724759,5.81113853 C-0.826075091,9.77692693 -0.247870665,14.6059952 2.6515151,17.9569414"
                                                        id="Path"
                                                        stroke="#3560FF"
                                                    />
                                                    <polyline
                                                        id="Path"
                                                        stroke="#3560FF"
                                                        points="19.6458087 17.3789847 14.3565525 12.0897285 9.06729634 17.3789847"
                                                    />
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </figure>
                    <span>Drop Or Add Files Here</span>

                    <p class="separator">
                        <span>or</span>
                    </p>
                    <q-btn label="Browse" />
                </div>
            </div>
        </vue-dropzone>
        <attachment-list />
        <template v-if="processing">
            <span>Optimizing Images</span>
            <q-linear-progress indeterminate rounded track-color="orange" color="purple" class="q-mt-sm" />
        </template>
    </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import attachmentList from '../components/AttachmentList'
import optimize from './imageprocess.js'

export default {
    name: 'PageIndex',
    components: { vueDropzone: vue2Dropzone, attachmentList },
    data() {
        return {
            msg: '',
            processing: false,
            tempAttachments: [],
            attachments: [],
            dropzoneOptions: {
                url: `the server url, where you want your filesto be sent`,
                maxFilesize: 50,
                // eslint-disable-next-line
                paramName: n => {
                    return 'file[]'
                },
                acceptedFiles: 'image/*',
                dictDefaultMessage: 'Upload Files Here xD',
                includeStyling: false,
                previewsContainer: false,
                thumbnailWidth: 250,
                thumbnailHeight: 140,
                uploadMultiple: true,
                parallelUploads: 20,
                // eslint-disable-next-line
                accept(file, done) {
                    // const reader = new FileReader()
                    // reader.addEventListener('loaded', event => {
                    //     console.log('RESULT OF FILE TARGET', event.target.result)
                    // })
                    // console.log('file reader read!!')
                    // reader.readAsText(file)
                },
            },
        }
    },
    mounted() {},
    methods: {
        // function called for every file dropped or selected
        async filesAdded(files) {
            console.log('Files Dropped => ', files)

            const acceptedFiles = files.filter(f => ['image/jpeg', 'image/png', 'image/gif', 'image/svg'].includes(f.type))
            const rejectedFiles = files.filter(f => !['image/jpeg', 'image/png', 'image/gif', 'image/svg'].includes(f.type))

            acceptedFiles.map(f => {
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
                return f
            })
            console.log('ran files!', acceptedFiles, rejectedFiles)

            if (rejectedFiles.length) {
                this.$q.notify(`Error processing ${rejectedFiles.length} files. Invalid file type.`)
            }
            if (acceptedFiles.length > 0) {
                this.processing = true
                const paths = acceptedFiles.map(f => f.path)
                console.log('starting optimize')
                const results = await optimize(new Event('squishing'), paths)
                this.processing = false
                this.$emit('results', results)
            }
        },
        // a middle layer function where you can change the XHR request properties
        // eslint-disable-next-line
        sendingFiles(files, xhr, formData) {
            console.log('if you want to change the upload time or add data to the formData you can do it here.')
            console.log('Files sending', files)
        },
        fileError(error) {
            console.error(error)
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

<style scoped>
file-selector {
    padding: 55px;
    font-weight: 600;
    background-color: #f9f9f9;
    color: #4e5b69;
    z-index: -9;
}
figure {
    margin: 0px;
}

.dropzone-container {
    display: flex;
    flex-direction: column;
    border: 1px dashed #ccc;
    border-radius: 15px;
}
h1,
h2 {
    font-weight: normal;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}

.separator {
    position: relative;
}
.separator:after {
    position: absolute;
    content: '';
    height: 1px;
    width: 200px;
    background: #d8d8d8;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
span {
    position: relative;
    background: #f9f9f9;
    padding: 0 4px;
    z-index: 9;
    font-size: 12px;
    color: #4e5b69;
}
</style>
