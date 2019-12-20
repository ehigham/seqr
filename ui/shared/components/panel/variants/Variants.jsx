import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Grid, Divider } from 'semantic-ui-react'
import intersection from 'lodash/intersection'

import { CLINSIG_SEVERITY, getVariantMainGeneId } from 'shared/utils/constants'
import FamilyVariantReads from './FamilyVariantReads'
import FamilyVariantTags from './FamilyVariantTags'
import Annotations from './Annotations'
import Pathogenicity from './Pathogenicity'
import Predictions from './Predictions'
import Frequencies from './Frequencies'
import VariantGene from './VariantGene'
import VariantIndividuals from './VariantIndividuals'
import { VerticalSpacer } from '../../Spacers'


const StyledVariantRow = styled(({ isCompoundHet, ...props }) => <Grid.Row {...props} />)`  
  .column {
   ${(props => props.isCompoundHet) ? // eslint-disable-line  no-constant-condition
    '{ margin-top: 0em !important; margin-left: 1em !important; }' :
    '{ margin-top: 1em !important; margin-bottom: 0 !important; margin-left: 1em !important; }'}
  }
  
  padding: 0;
  color: #999;
  background-color: ${({ severity }) => {
    if (severity > 0) {
      return '#eaa8a857'
    } else if (severity === 0) {
      return '#f5d55c57'
    } else if (severity < 0) {
      return '#21a92624'
    }
    return 'inherit'
  }}
`

const StyledCompoundHetRows = styled(Grid)`
  margin-left: 0em !important;
  margin-right: 1em !important;
  margin-top: 0em !important;
  margin-bottom: 0 !important;
`

const Variant = ({ variant, isCompoundHet }) => {
  const mainGeneId = getVariantMainGeneId(variant)
  const variantGenes = Object.keys(variant.transcripts).filter(geneId => geneId !== mainGeneId).map(geneId =>
    <VariantGene key={geneId} geneId={geneId} variant={variant} compact />,
  )
  const variantIndividuals = variant.familyGuids.map(familyGuid =>
    <VariantIndividuals key={familyGuid} familyGuid={familyGuid} variant={variant} />,
  )
  return (
    <StyledVariantRow key={variant.variant} severity={CLINSIG_SEVERITY[(variant.clinvar.clinicalSignificance || '').toLowerCase()]} isCompoundHet >
      <Grid.Column width={16}>
        <Pathogenicity variant={variant} />
      </Grid.Column>
      {variant.familyGuids.map(familyGuid =>
        <Grid.Column key={familyGuid} width={16}>
          <FamilyVariantTags familyGuid={familyGuid} variant={variant} key={variant.variantId} isCompoundHet={isCompoundHet} />
        </Grid.Column>,
      )}
      {isCompoundHet &&
      <Grid.Column>
        {variantGenes}
        {Object.keys(variant.transcripts).length > 1 && <VerticalSpacer height={20} />}
        {variantIndividuals}
      </Grid.Column>}
      {!isCompoundHet &&
      <Grid.Column>
        {mainGeneId && <VariantGene geneId={mainGeneId} variant={variant} />}
        {Object.keys(variant.transcripts).length > 1 && <Divider />}
        {variantGenes}
      </Grid.Column>}
      <Grid.Column><Annotations variant={variant} /></Grid.Column>
      <Grid.Column><Predictions variant={variant} /></Grid.Column>
      <Grid.Column><Frequencies variant={variant} /></Grid.Column>
      {!isCompoundHet &&
      <Grid.Column width={16}>
        {variantIndividuals}
      </Grid.Column>}
      <Grid.Column width={16}>
        <FamilyVariantReads variant={variant} />
      </Grid.Column>
    </StyledVariantRow>
  )
}

Variant.propTypes = {
  variant: PropTypes.object,
  isCompoundHet: PropTypes.bool,
}


const CompoundHets = ({ variants }) => {
  const sharedGeneIds = intersection(variants.map(({ transcripts }) => Object.keys(transcripts))[0]) || []
  return (
    <StyledVariantRow key={variants.map(v => v.variantId).join()} >
      <VerticalSpacer height={16} />
      {variants[0].familyGuids.map(familyGuid =>
        <Grid.Column key={familyGuid} width={16}>
          <FamilyVariantTags familyGuid={familyGuid} variant={variants} key={variants.map(v => v.variantId).join()} />
        </Grid.Column>,
      )}
      <Grid.Column width={16}>
        {sharedGeneIds[0] && <VariantGene geneId={sharedGeneIds[0]} variant={variants[0]} areCompoundHets />}
      </Grid.Column>
      <StyledCompoundHetRows stackable columns="equal">
        {variants.map(compoundHet =>
          <Variant variant={compoundHet} key={compoundHet.variantId} isCompoundHet />,
        )}
      </StyledCompoundHetRows>
    </StyledVariantRow>
  )
}


CompoundHets.propTypes = {
  variants: PropTypes.array,
}

const Variants = ({ variants }) => {
  return (
    <Grid stackable divided="vertically" columns="equal">
      {variants.map(variant =>
        (Array.isArray(variant) ? <CompoundHets variants={variant} key={variant.map(v => v.variantId).join()} /> : <Variant variant={variant} key={variant.variantId} />))}
    </Grid>
  )
}

Variants.propTypes = {
  variants: PropTypes.array,
}

export default Variants
