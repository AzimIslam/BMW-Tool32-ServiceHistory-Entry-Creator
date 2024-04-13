import { mount } from '@vue/test-utils'
import { expect, it, describe } from 'vitest'

import App from '../App.vue'

const wrapper = mount(App)

describe('App', () => {
  it('should render logo', () => {
    const expectedImgPath = '/src/assets/fulllogo_transparent.png'

    const img = wrapper.find('v-img')

    expect(img.exists()).toBeTruthy()
    expect(img.element.getAttribute('src')).toEqual(expectedImgPath)
  })

  it('should render title', () => {
    const expectedTitleText = 'BMW Tool32 Service History Generator'

    const title = wrapper.get('.text-h5').element.innerHTML

    expect(title).toEqual(expectedTitleText)
  })

  it('should render maintenance date field', () => {
    const textFields = wrapper.findAll('v-text-field')
    const maintenanceDateField = textFields.filter(
      (field) => field.element.getAttribute('type') == 'date'
    )[0]

    expect(maintenanceDateField.exists()).toBeTruthy()
    expect(maintenanceDateField.element.getAttribute('label')).toEqual('Maintenance Date')
  })

  it('should render mileage field', () => {
    const textFields = wrapper.findAll('v-text-field')
    const mileageField = textFields.filter(
      (field) => field.element.getAttribute('type') == 'number'
    )[2]

    expect(mileageField.exists()).toBeTruthy()
    expect(mileageField.element.getAttribute('label')).toEqual('Mileage')
    expect(mileageField.element.getAttribute('min')).toEqual('1')
  })

  it('should render mileage unit select box', () => {})

  it('should display add button', () => {
    const btn = wrapper.find('Add')
    expect(btn).toBeDefined()
  })
})
