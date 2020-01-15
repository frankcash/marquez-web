import { mount } from 'enzyme'
import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import DatasetDetailPage from '../../components/DatasetDetailPage'
import { formatUpdatedAt } from '../../helpers'

const datasets = require('../../../docker/db/data/datasets.json')
const dataset = datasets[0]

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: jest.fn(),
  useHistory: () => ({
    push: jest.fn()
  })
}))

import { useParams } from 'react-router-dom'

describe('DatasetDetailPage Component', () => {

  describe('when there is no match for the datasetName in url params', () => {
    useParams.mockImplementation(() => ({
      datasetName: 'test.dataset'
    }))

    const wrapper = mount(<DatasetDetailPage />)
    wrapper.setProps({ datasets })

    it('should render', () => {
      expect(wrapper.exists()).toBe(true)
    })
    it('should render text explaning that there was no matching dataset found', () => {
      expect(
        wrapper
          .find(Typography)
          .text()
          .toLowerCase()
      ).toContain('no dataset')
    })
    it('renders a snapshot that matches previous', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when there is a match for the datasetName in url params', () => {
    useParams.mockImplementation(() => ({
      datasetName: dataset.name
    }))
    const wrapper = mount(<DatasetDetailPage/>)
    wrapper.setProps({ datasets })

    it('should render', () => {
      expect(wrapper.exists()).toBe(true)
    })
    it(`does not render 'no dataset'`, () => {
      expect(
        wrapper.findWhere(n =>
          n
            .text()
            .toLowerCase()
            .includes('no dataset')
        )
      ).toHaveLength(0)
    })
    it('should render the dataset name', () => {
      expect(
        wrapper
          .find(Typography)
          .first()
          .text()
      ).toContain(dataset.name)
    })
    it('should render the dataset description', () => {
      expect(
        wrapper
          .find(Typography)
          .at(1)
          .text()
      ).toContain(dataset.description)
    })
    it('should render the dataset time', () => {
      expect(
        wrapper
          .find(Typography)
          .at(2)
          .text()
      ).toContain(formatUpdatedAt(dataset.updatedAt))
    })
    it('renders a snapshot that matches previous', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})