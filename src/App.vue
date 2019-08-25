<template>
  <div id="q-app">
    <file-picker :allow-multiple="true" />
    test
    <router-view />
  </div>
</template>

<script>
import filePicker from "vue-file-picker/filePicker.vue";
// eslint-disable-next-line
import imageCompression from "browser-image-compression";
// eslint-disable-next-line
async function handleImageUpload(event) {
  const imageFile = event.target.files[0];
  console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
  console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

  var options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log(
      "compressedFile instanceof Blob",
      compressedFile instanceof Blob
    ); // true
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

    // await uploadToServer(compressedFile); // write your own logic
  } catch (error) {
    console.log(error);
  }
}

export default {
  name: "App",
  components: {
    filePicker
  },
  mounted() {
    // We will be compressing images [jpg] with two algorithms, [webp] and [jpg];
    // gulp compress_images
  }
};
</script>

<style></style>
