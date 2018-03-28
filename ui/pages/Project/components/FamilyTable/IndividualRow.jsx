import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Grid, Popup, Icon } from 'semantic-ui-react'
import Timeago from 'timeago.js'
import orderBy from 'lodash/orderBy'

import PedigreeIcon from 'shared/components/icons/PedigreeIcon'
import TextFieldView from 'shared/components/panel/view-fields/TextFieldView'
import PhenotipsDataPanel from 'shared/components/panel/view-phenotips-info/PhenotipsDataPanel'

import {
  CASE_REVIEW_STATUS_MORE_INFO_NEEDED,
  CASE_REVIEW_STATUS_NOT_IN_REVIEW,
  CASE_REVIEW_STATUS_OPT_LOOKUP,
} from 'shared/constants/caseReviewConstants'

import {
  ANALYSIS_TYPE_VARIANT_CALLS,
} from 'shared/constants/datasetAndSampleConstants'

import { getUser, getProject, getProjectSamples, getProjectDatasets } from 'redux/rootReducer'
import { EDIT_INDIVIDUAL_INFO_MODAL_ID } from 'shared/components/panel/edit-one-of-many-individuals/EditIndividualInfoModal'


import {
  getShowDetails,
} from '../../reducers'

const detailsStyle = {
  padding: '5px 0 5px 5px',
  fontSize: '11px',
  fontWeight: '500',
  color: '#999999',
}

class IndividualRow extends React.Component
{
  static propTypes = {
    user: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    family: PropTypes.object.isRequired,
    individual: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
    samples: PropTypes.array.isRequired,
    datasets: PropTypes.array.isRequired,
  }

  render() {
    const { user, project, family, individual, showDetails } = this.props

    const { individualId, displayName, paternalId, maternalId, sex, affected, createdDate } = individual

    const caseReviewStatusOpt = CASE_REVIEW_STATUS_OPT_LOOKUP[individual.caseReviewStatus]

    const individualRow = (
      <Grid stackable style={{ width: '100%' }}>
        <Grid.Row style={{ padding: '0px' }}>
          <Grid.Column width={3} style={{ maxWidth: '250px', padding: '0px 0px 15px 15px' }}>
            <span>
              <div style={{ display: 'block', verticalAlign: 'top', whiteSpace: 'nowrap' }} >
                <PedigreeIcon style={{ fontSize: '13px' }} sex={sex} affected={affected} />
                &nbsp;
                {displayName || individualId}
              </div>
              <div style={{ display: 'block' }} >
                {
                  (!family.pedigreeImage && ((paternalId && paternalId !== '.') || (maternalId && maternalId !== '.'))) ? (
                    <div style={detailsStyle}>
                      child of &nbsp;
                      <i>{(paternalId && maternalId) ? `${paternalId} and ${maternalId}` : (paternalId || maternalId) }</i>
                      <br />
                    </div>
                  ) : null
                }
                {
                  showDetails ? (
                    <div style={detailsStyle}>
                      ADDED {new Timeago().format(createdDate).toUpperCase()}
                    </div>
                    ) : null
                }
              </div>
            </span>
          </Grid.Column>
          <Grid.Column width={10} style={{ maxWidth: '950px', padding: '0px 0px 15px 15px' }}>
            {
              ((showDetails && individual.caseReviewStatus && individual.caseReviewStatus !== CASE_REVIEW_STATUS_NOT_IN_REVIEW) ||
              (individual.caseReviewStatus === CASE_REVIEW_STATUS_MORE_INFO_NEEDED)) ?
                <div style={{ padding: '0px 0px 10px 0px' }}>
                  <span style={{ paddingRight: '10px' }}>
                    <b>Case Review - Status:</b>
                    <span style={{ marginLeft: '15px', color: caseReviewStatusOpt ? caseReviewStatusOpt.color : 'black' }}>
                      <b>{caseReviewStatusOpt ? caseReviewStatusOpt.name : individual.caseReviewStatus}</b>
                    </span>
                  </span>
                  {
                    <TextFieldView
                      isVisible={individual.caseReviewStatus === CASE_REVIEW_STATUS_MORE_INFO_NEEDED}
                      isEditable={user.is_staff || project.canEdit}
                      fieldName="➙ Discussion"
                      initialText={individual.caseReviewDiscussion}
                      textEditorId={EDIT_INDIVIDUAL_INFO_MODAL_ID}
                      textEditorTitle={`Case Review Discussion for Individual ${individual.individualId}`}
                      textEditorSubmitUrl={`/api/individual/${individual.individualGuid}/update/caseReviewDiscussion`}
                    />
                  }
                </div>
                : null
            }
            {
              showDetails ?
                <div style={{ padding: '0px 0px 10px 0px' }}>
                  {
                    <TextFieldView
                      isEditable={user.is_staff || project.canEdit}
                      fieldName="Individual Notes"
                      initialText={individual.notes}
                      textEditorId={EDIT_INDIVIDUAL_INFO_MODAL_ID}
                      textEditorTitle={`Notes for Individual ${individual.individualId}`}
                      textEditorSubmitUrl={`/api/individual/${individual.individualGuid}/update/notes`}
                    />
                  }
                </div>
                : null
            }
            <PhenotipsDataPanel
              project={project}
              individual={individual}
              showDetails={showDetails}
              showEditPhenotipsLink={project.canEdit}
            />
          </Grid.Column>
          <Grid.Column width={3}>
            <div>
              {
                this.props.samples.filter(s => s.individualGuid === individual.individualGuid).map((sample) => {
                  let loadedVariantCallDatasets = this.props.datasets
                    .filter(dataset => (
                      dataset.sampleGuids.includes(sample.sampleGuid) &&
                      dataset.analysisType === ANALYSIS_TYPE_VARIANT_CALLS &&
                      dataset.isLoaded
                    ))

                  loadedVariantCallDatasets = orderBy(loadedVariantCallDatasets, [d => d.loadedDate], 'desc')

                  return (
                    <div key={sample.sampleGuid}>
                      {
                        <Popup
                          trigger={<Icon size="small" name="circle" color={loadedVariantCallDatasets.length > 0 ? 'green' : 'red'} />}
                          content={loadedVariantCallDatasets.length > 0 ? 'data has been loaded' : 'no data available'}
                          position="left center"
                        />
                      }
                      <span style={{ marginLeft: '8px' }}><b>{sample.sampleType}</b></span>
                      {
                        loadedVariantCallDatasets.length > 0 &&
                        <span style={detailsStyle}>
                          LOADED {new Timeago().format(loadedVariantCallDatasets[0].loadedDate).toUpperCase()}
                        </span>
                      }
                    </div>
                  )
                })
              }
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>)

    return individualRow
  }
}

export { IndividualRow as IndividualRowComponent }

const mapStateToProps = state => ({
  user: getUser(state),
  project: getProject(state),
  showDetails: getShowDetails(state),
  samples: getProjectSamples(state),
  datasets: getProjectDatasets(state),
})

export default connect(mapStateToProps)(IndividualRow)
