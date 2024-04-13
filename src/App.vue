<script setup>
import logoTransparent from './assets/fulllogo_transparent.png'
</script>

<template>
  <v-app>
    <v-app-bar class="pa-2">
      <v-img
        :width="64"
        :src="logoTransparent"
        @click="redirectToHomepage"
        style="cursor: pointer"
        center
      >
      </v-img>
    </v-app-bar>

    <v-dialog v-model="addModalOpen" max-width="500px">
      <v-card>
        <v-card-title>Add Service History Entry</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="serviceItemModalField"
                  :items="getServiceItems"
                  label="Service Item"
                ></v-select>
                <v-select
                  v-model="maintenanceStatusModalField"
                  :items="getMaintenanceStatusItems"
                  label="Maintenance Status"
                ></v-select>
                <v-text-field
                  v-model="distanceRemainingModalField"
                  type="number"
                  v-bind:label="`Distance remaining (${mileageUnit})`"
                  v-bind:disabled="maintenanceStatusModalField == 'On time'"
                ></v-text-field>
                <v-text-field
                  v-model="timeRemainingModalField"
                  type="number"
                  min="0"
                  label="Time remaining (months)"
                  v-bind:disabled="maintenanceStatusModalField == 'On time'"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addEntry">Add</v-btn>
          <v-btn @click="closeAddModal">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container class="mt-16">
      <div class="text-h5 text-center mt-6">BMW Tool32 Service History Generator</div>
      <v-row class="mt-2" justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="pa-4">
            <v-text-field
              v-model="maintenanceDate"
              label="Maintenance Date"
              type="date"
            ></v-text-field>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  type="number"
                  min="1"
                  v-model.number="mileage"
                  label="Mileage"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select v-model="mileageUnit" :items="['km', 'mi']"></v-select>
              </v-col>
            </v-row>
            <v-text-field
              v-model="dealerName"
              label="Dealer Name (7 Chars Max)"
              maxlength="7"
            ></v-text-field>
            <v-select v-model="bmwService" label="BMW Service" :items="['Yes', 'No']"> </v-select>
            <v-select
              v-model="maintenanceStatus"
              :items="getMaintenanceStatusItems"
              label="Maintenance Status"
            ></v-select>
            <v-snackbar :timeout="2000" color="deep-purple-accent-4" elevation="24">
              <template v-slot:activator="{ props }">
                <v-btn
                  prepend-icon="fa-regular fa-copy"
                  color="secondary"
                  v-bind="props"
                  :disabled="serviceEntries.length === 0"
                  @click="copyGeneratedArgument"
                  >Copy Generated Argument</v-btn
                >
              </template>

              Copied generated argument to clipboard.
            </v-snackbar>
          </v-card>
        </v-col>
        <v-col cols="12" sm="8" md="6">
          <v-card class="pa-4">
            <v-simple-table>
              <thead>
                <tr>
                  <th class="pa-2">Service</th>
                  <th class="pa-2">Completion Status</th>
                  <th class="pa-2">Distance remaining</th>
                  <th class="pa-2">Time remaining</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in serviceEntries" :key="index">
                  <td class="pa-2">{{ item.name }}</td>
                  <td class="pa-2">{{ item.maintenance }}</td>
                  <td class="pa-2">{{ item.distanceRemaining + `${mileageUnit}` }}</td>
                  <td class="pa-2">{{ item.timeRemaining }} months</td>
                  <td class="pa-2">
                    <v-btn
                      color="secondary"
                      prepend-icon="fa-solid fa-trash"
                      @click="removeEntry(index)"
                      >Remove</v-btn
                    >
                  </td>
                </tr>
                <v-btn
                  color="primary"
                  prepend-icon="fa-solid fa-plus"
                  class="mt-4"
                  @click="openAddModal"
                  >Add</v-btn
                >
              </tbody>
            </v-simple-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      serviceEntries: [],
      serviceItemModalField: 'Engine oil',
      maintenanceStatusModalField: 'On time',
      distanceRemainingModalField: 0,
      timeRemainingModalField: 0,
      addModalOpen: false,
      maintenanceDate: new Date().toISOString().split('T')[0],
      mileage: 1,
      mileageUnit: 'km',
      bmwService: 'Yes',
      dealerName: 'BMAUTOT',
      maintenanceStatus: 'On time',
      maintenanceStates: [
        { id: '0x1', value: 'On time' },
        { id: '0x2', value: 'Late' },
        { id: '0x3', value: 'Incomplete' }
      ],
      serviceItems: [
        { id: 1, service: 'Engine oil' },
        { id: 2, service: 'Front brake' },
        { id: 3, service: 'Brake fluid' },
        { id: 4, service: 'Microfilter' },
        { id: 5, service: 'Recirculation filter' },
        { id: 6, service: 'Rear brake' },
        { id: 10, service: 'Spark plugs' },
        { id: 11, service: 'Air filter element' },
        { id: 12, service: 'Fuel filter' },
        { id: 100, service: 'Vehicle inspection' },
        { id: 32, service: 'Statutory vehicle inspection' }
      ]
    }
  },
  computed: {
    getServiceItems() {
      return this.serviceItems.map((item) => item.service)
    },
    getMaintenanceStatusItems() {
      return this.maintenanceStates.map((item) => item.value)
    }
  },
  methods: {
    copyGeneratedArgument() {
      const formattedDate = this.maintenanceDate.split('-')
      const formattedMileage = this.mileageUnit === 'km' ? this.mileage : this.miToKm(this.mileage)
      const formattedByBMW = this.bmwService === 'Yes' ? '1' : '0'
      const formattedMaintenanceState = this.maintenanceStates.find(
        (element) => element.value === this.maintenanceStatus
      )

      let argument = `${formattedDate[2]};${formattedDate[1]};${formattedDate[0]};0;${formattedMileage};${formattedByBMW};${this.dealerName};${formattedMaintenanceState.id};${this.serviceEntries.length};`

      for (let i = 0; i < this.serviceEntries.length; i++) {
        const serviceId = this.serviceItems.find(
          (item) => item.service == this.serviceEntries[i].name
        ).id
        const maintenanceId = this.maintenanceStates.find(
          (item) => item.value == this.serviceEntries[i].maintenance
        ).id
        const actualDistance =
          this.mileageUnit == 'km'
            ? this.serviceEntries[i].distanceRemaining
            : this.miToKm(this.serviceEntries[i].distanceRemaining)

        argument += `${serviceId};${maintenanceId};${actualDistance};${this.serviceEntries[i].timeRemaining};`
      }
      navigator.clipboard.writeText(argument)
    },
    openAddModal() {
      this.addModalOpen = true
    },
    closeAddModal() {
      this.addModalOpen = false
    },
    miToKm(mi) {
      return Math.round(mi / 0.621371)
    },
    redirectToHomepage() {
      window.location.href = 'http://bmautotech.co.uk'
    },
    addEntry() {
      this.serviceEntries.push({
        name: this.serviceItemModalField,
        maintenance: this.maintenanceStatusModalField,
        distanceRemaining: this.distanceRemainingModalField,
        timeRemaining: this.timeRemainingModalField
      })

      this.closeAddModal()
    },

    removeEntry(index) {
      this.serviceEntries.splice(index, 1)
    }
  }
}
</script>
