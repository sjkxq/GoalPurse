import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ProgressBar from './ProgressBar.vue'

describe('ProgressBar', () => {
  it('renders progress correctly', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        current: 50,
        target: 100
      }
    })

    expect(wrapper.find('.progress-text').text()).toBe('50%')
    expect(wrapper.find('.progress-fill').attributes('style')).toContain('width: 50%')
  })

  it('shows 0% when target is 0', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        current: 50,
        target: 0
      }
    })

    expect(wrapper.find('.progress-text').text()).toBe('0%')
    expect(wrapper.find('.progress-fill').attributes('style')).toContain('width: 0%')
  })

  it('caps progress at 100%', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        current: 150,
        target: 100
      }
    })

    expect(wrapper.find('.progress-text').text()).toBe('100%')
    expect(wrapper.find('.progress-fill').attributes('style')).toContain('width: 100%')
  })

  it('shows 100% when completed', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        current: 50,
        target: 100,
        completed: true
      }
    })

    expect(wrapper.find('.progress-text').text()).toBe('100%')
    expect(wrapper.find('.progress-fill').attributes('style')).toContain('width: 100%')
    expect(wrapper.find('.progress-fill').classes()).toContain('completed')
  })

  it('applies correct CSS class based on progress', () => {
    // Low progress (less than 30%)
    const lowProgress = mount(ProgressBar, {
      props: {
        current: 20,
        target: 100
      }
    })
    expect(lowProgress.find('.progress-fill').classes()).toContain('low')

    // Medium progress (30% to 69%)
    const mediumProgress = mount(ProgressBar, {
      props: {
        current: 50,
        target: 100
      }
    })
    expect(mediumProgress.find('.progress-fill').classes()).toContain('medium')

    // High progress (70% or more)
    const highProgress = mount(ProgressBar, {
      props: {
        current: 80,
        target: 100
      }
    })
    expect(highProgress.find('.progress-fill').classes()).toContain('high')
  })
})