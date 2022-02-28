import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Popup } from 'semantic-ui-react'
import { connect } from 'react-redux'

import { getLocusListsByGuid } from 'redux/selectors'
import { LocusListsLoader } from 'shared/components/LocusListLoader'
import LocusListDetailPanel from 'shared/components/panel/genes/LocusListDetail'
import LocusListTables from 'shared/components/table/LocusListTables'
import { CreateLocusListButton } from 'shared/components/buttons/LocusListButtons'
import UpdateButton from 'shared/components/buttons/UpdateButton'
import DeleteButton from 'shared/components/buttons/DeleteButton'
import Modal from 'shared/components/modal/Modal'
import { HelpIcon, ButtonLink } from 'shared/components/StyledComponents'
import { updateLocusLists } from '../reducers'

const ItemContainer = styled.div`
  padding: 2px 0px;
  white-space: nowrap;
`

const LocusListItem = React.memo(({ project, locusList, onSubmit }) => (
  <ItemContainer key={locusList.locusListGuid}>
    <Modal
      title={`${locusList.name} Gene List`}
      modalName={`${project.projectGuid}-${locusList.name}-genes`}
      trigger={<ButtonLink>{locusList.name}</ButtonLink>}
      size="large"
    >
      <LocusListDetailPanel locusListGuid={locusList.locusListGuid} />
    </Modal>
    <Popup
      position="right center"
      trigger={<HelpIcon />}
      content={
        <div>
          <b>{`${locusList.numEntries} Genes`}</b>
          <br />
          <i>{locusList.description}</i>
        </div>
      }
      size="small"
    />
    {project.canEdit && (
      <DeleteButton
        onSubmit={onSubmit}
        size="tiny"
        confirmDialog={
          <div className="content">
            Are you sure you want to remove &nbsp;
            <b>{locusList.name}</b>
            &nbsp; from this project
          </div>
        }
      />
    )}
  </ItemContainer>
))

LocusListItem.propTypes = {
  project: PropTypes.object.isRequired,
  locusList: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  locusList: getLocusListsByGuid(state)[ownProps.locusListGuid],
})

const mapItemDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: values => dispatch(updateLocusLists({ ...values, locusListGuids: [ownProps.locusListGuid] })),
})

const LocusList = connect(mapStateToProps, mapItemDispatchToProps)(LocusListItem)

export const GeneLists = React.memo(({ project }) => (project.locusListGuids || []).map(
  locusListGuid => <LocusList key={locusListGuid} project={project} locusListGuid={locusListGuid} />,
))

GeneLists.propTypes = {
  project: PropTypes.object.isRequired,
}

const LOCUS_LIST_FIELDS = [{
  name: 'locusListGuids',
  component: LocusListTables,
  basicFields: true,
  parse: value => Object.keys(value || {}).filter(locusListGuid => value[locusListGuid]),
  format: value => (value || []).reduce((acc, locusListGuid) => ({ ...acc, [locusListGuid]: true }), {}),
}]

const LocustListsContainer = ({ project, children }) => (
  <LocusListsLoader>
    {`Add an existing Gene List to ${project.name} or `}
    <CreateLocusListButton />
    {children}
  </LocusListsLoader>
)

LocustListsContainer.propTypes = {
  project: PropTypes.object,
  children: PropTypes.node,
}

const AddGeneLists = React.memo(({ project, onSubmit }) => (
  <UpdateButton
    modalTitle="Add Gene Lists"
    modalId={`add-gene-list-${project.projectGuid}`}
    modalSize="large"
    buttonText="Add Gene List"
    editIconName="plus"
    formContainer={<LocustListsContainer project={project} />}
    onSubmit={onSubmit}
    formFields={LOCUS_LIST_FIELDS}
  />
))

AddGeneLists.propTypes = {
  project: PropTypes.object,
  onSubmit: PropTypes.func,
}

const mapDispatchToProps = { onSubmit: updateLocusLists }

export const AddGeneListsButton = connect(null, mapDispatchToProps)(AddGeneLists)
