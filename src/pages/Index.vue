<template>
    <q-page class>
        <div class="absolute-center">
            <template v-if="!showResults">
                <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <attachment @results="handleResults" />
                </transition>
            </template>
        </div>
        <div class="absolute-center">
            <template v-if="showResults">
                <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <div class="column">
                        <q-list bordered separator>
                            <q-item>
                                <q-item-section>
                                    <q-item-label overline>Number of Files</q-item-label>
                                    <q-item-label>{{ results.numFiles }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label overline>Total Time</q-item-label>
                                    <q-item-label>{{ results.timeTaken }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label overline>Size decreased by</q-item-label>
                                    <q-item-label>{{ results.perctSaved }} %</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label overline>You saved</q-item-label>
                                    <q-item-label>{{ results.bytesSaved }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                        <q-btn class="q-mt-md" color="primary" label="Squish Again!" @click="showResults = false" />
                    </div>
                </transition>
            </template>
        </div>
        <span class="absolute-bottom">Total Bytes Saved {{ totalBytesSaved }}</span>
        <!-- <q-btn class="q-mt-md" color="primary" label="toggle" @click="showResults = !showResults" /> -->
    </q-page>
</template>

<style></style>

<script>
import prettyBytes from 'pretty-bytes'
import attachment from '../components/Attachment'

export default {
    name: 'PageIndex',
    components: { attachment },
    data() {
        return {
            showResults: false,
            totalSaved: 0,
            results: {},
        }
    },
    mounted() {
        this.totalSaved = Number(this.$q.localStorage.getItem('totalSaved'))
    },
    computed: {
        totalBytesSaved() {
            return prettyBytes(this.totalSaved)
        },
    },
    methods: {
        handleResults(results) {
            console.log('results!', results)
            const totalSaved = Number(this.$q.localStorage.getItem('totalSaved'))
            this.totalSaved = Number(totalSaved || 0) + Number(results.rawBytes)
            this.$q.localStorage.set('totalSaved', this.totalSaved)
            this.results = results
            this.showResults = true
        },
    },
}
</script>
