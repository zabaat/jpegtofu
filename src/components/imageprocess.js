import plur from 'plur'
import fs from 'fs-extra'
import imagemin from 'imagemin'
import prettyBytes from 'pretty-bytes'
import { sync as DataURI } from 'datauri'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminPngquant from 'imagemin-pngquant'
import imageminGifsicle from 'imagemin-gifsicle'
import imageminSvgo from 'imagemin-svgo'
import { Notify } from 'quasar'

const imageMinPlugins = [
    imageminJpegtran(),
    imageminPngquant({ quality: '65-80' }),
    imageminGifsicle({ optimizationLevel: 2 }),
    imageminSvgo({
        plugins: [
            {
                removeTitle: true,
                removeDimensions: true,
            },
        ],
    }),
]

async function msToHuman(ms) {
    // const hours = Math.floor(ms / 3600000) // 1 Hour = 36000 Milliseconds
    const minutes = Math.floor((ms % 3600000) / 60000) // 1 Minutes = 60000 Milliseconds
    const seconds = Math.floor(((ms % 360000) % 60000) / 1000) // 1 Second = 1000 Milliseconds

    if (seconds === '0') return `${ms}ms`
    return minutes > 60000 ? `${minutes}m ${seconds}s` : `${seconds} seconds`
}

async function calculateDelta(originalSize, optimizedSize) {
    const saved = originalSize - optimizedSize
    const percent = originalSize > 0 ? (saved / originalSize) * 100 : 0
    // const zeroSum = !(saved > 0)

    const deltaPerct = percent.toFixed(1).replace(/\.0$/, '')
    const deltaBytes = prettyBytes(saved)

    return { deltaPerct, deltaBytes }
}

async function calculateTotDelta(totalOriginalSize, totalOptimizedSize) {
    const originalSize = totalOriginalSize.reduce((acc, num) => acc + num)
    const optimizedSize = totalOptimizedSize.reduce((acc, num) => acc + num)
    const saved = originalSize - optimizedSize
    const { deltaPerct, deltaBytes } = await calculateDelta(originalSize, optimizedSize)
    return { deltaPerct, deltaBytes, rawBytes: saved }
}

// eslint-disable-next-line
async function notify({ numFiles, timeTaken, bytesSaved, perctSaved, imagePath }) {
    Notify.create({
        message: `${numFiles} ${plur('file', numFiles)} optimized!`,
        icon: 'thumb_up',
    })
}

/**
 * Optimizes individual image files and returns
 * compression data.
 * @param  {[type]} path Absolute path to the file
 * @return {object} Status object of conversion
 */
async function optimizeFile(path) {
    try {
        console.log('0')
        const dataUri = await DataURI(path)
        console.log('1')
        const originalBuffer = await fs.readFile(path)
        console.log('2')
        const optimizedBuffer = await imagemin.buffer(originalBuffer, { plugins: imageMinPlugins })
        console.log('3')
        await fs.writeFile(path, optimizedBuffer)
        console.log('4')
        return {
            dataUri,
            originalSize: originalBuffer.length,
            optimizedSize: optimizedBuffer.length,
        }
    } catch (error) {
        console.error('Error: ', error)
        return { status: false, originalSize: null, optimizedSize: null }
    }
}

async function optimize(event, files) {
    const startTime = new Date()
    const totalOriginalSize = []
    const totalOptimizedSize = []
    const fileData = {}

    // Runs file optimizations in parallel
    // Stackoverflow:- https://goo.gl/wGdkog
    await Promise.all(
        files.map(async (file, index) => {
            console.log('starting file', file)
            const { dataUri, originalSize, optimizedSize } = await optimizeFile(file)
            console.log('file did optimize yay?')
            totalOriginalSize.push(originalSize)
            totalOptimizedSize.push(optimizedSize)

            const { deltaPerct, deltaBytes } = await calculateDelta(originalSize, optimizedSize)

            fileData[index] = {}
            fileData[index].path = file
            fileData[index].dataUri = dataUri
            fileData[index].fileName = file.replace(/^.*[\\/]/, '')
            fileData[index].originalSize = prettyBytes(originalSize)
            fileData[index].optimizedSize = prettyBytes(optimizedSize)
            fileData[index].deltaPerct = deltaPerct
            fileData[index].deltaBytes = deltaBytes
            console.log('fileData', fileData[index])
        })
    )

    const { deltaPerct, deltaBytes, rawBytes } = await calculateTotDelta(totalOriginalSize, totalOptimizedSize)
    const deltaTime = await msToHuman(new Date() - startTime)

    console.log(`Saved ${deltaBytes}, thats a ${deltaPerct}% ↓ in size`)
    // event.sender.send('files:optimized', fileData, { deltaBytes, deltaPerct })
    const results = {
        rawBytes,
        numFiles: files.length,
        timeTaken: deltaTime,
        bytesSaved: deltaBytes,
        perctSaved: deltaPerct,
        imagePath: files,
    }
    notify(results)
    return results
}

export default optimize
