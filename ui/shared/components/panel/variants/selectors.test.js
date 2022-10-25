/* eslint-disable no-undef */

import { STATE_WITH_2_FAMILIES } from 'pages/Project/fixtures'
import {
  getPairedSelectedSavedVariants,
  getVisibleSortedSavedVariants,
  getPairedFilteredSavedVariants,
  getSampleGeneDataByFamilyGene,
} from './selectors'

test('getPairedSelectedSavedVariants', () => {

  const savedAllVariants = getPairedSelectedSavedVariants(STATE_WITH_2_FAMILIES, { match: { params:  {} } })
  expect(savedAllVariants.length).toEqual(3)
  expect(savedAllVariants[0].variantGuid).toEqual('SV0000004_116042722_r0390_1000')
  expect(savedAllVariants[1].variantGuid).toEqual('SV0000002_1248367227_r0390_100')
  expect(savedAllVariants[2].length).toEqual(2)
  expect(savedAllVariants[2][0].variantGuid).toEqual('SV0000003_2246859832_r0390_100')
  expect(savedAllVariants[2][1].variantGuid).toEqual('SV0000005_2246859833_r0390_100')

  const savedReviewVariants = getPairedSelectedSavedVariants(
    STATE_WITH_2_FAMILIES, { match: { params:  { tag: 'Review' } } }
  )
  expect(savedReviewVariants.length).toEqual(2)
  expect(savedReviewVariants[0].variantGuid).toEqual('SV0000004_116042722_r0390_1000')
  expect(savedReviewVariants[1].variantGuid).toEqual('SV0000002_1248367227_r0390_100')

  const savedNotesVariants = getPairedSelectedSavedVariants(
    STATE_WITH_2_FAMILIES, { match: { params:  { tag: 'Has Notes' } } }
  )
  expect(savedNotesVariants.length).toEqual(1)
  expect(savedNotesVariants[0].variantGuid).toEqual('SV0000004_116042722_r0390_1000')


  const savedFamilyVariants = getPairedSelectedSavedVariants(
    STATE_WITH_2_FAMILIES, { match: { params:  { familyGuid: 'F011652_1' } } }
  )
  expect(savedFamilyVariants.length).toEqual(3)
  expect(savedFamilyVariants[0].variantGuid).toEqual('SV0000004_116042722_r0390_1000')
  expect(savedFamilyVariants[1].variantGuid).toEqual('SV0000002_1248367227_r0390_100')
  expect(savedFamilyVariants[2].variantGuid).toEqual('SV0000002_SV48367227_r0390_100')

  const savedAnalysisGroupVariants = getPairedSelectedSavedVariants(
    STATE_WITH_2_FAMILIES, { match: { params:  { analysisGroupGuid: 'AG0000183_test_group' } } }
  )
  expect(savedAnalysisGroupVariants.length).toEqual(3)
  expect(savedAnalysisGroupVariants[0].variantGuid).toEqual('SV0000004_116042722_r0390_1000')
  expect(savedAnalysisGroupVariants[1].variantGuid).toEqual('SV0000002_1248367227_r0390_100')
  expect(savedFamilyVariants[2].variantGuid).toEqual('SV0000002_SV48367227_r0390_100')


  const savedVariants = getPairedSelectedSavedVariants(
    STATE_WITH_2_FAMILIES, { match: { params:  { variantGuid: 'SV0000004_116042722_r0390_1000' } } }
  )
  expect(savedVariants.length).toEqual(1)
  expect(savedFamilyVariants[0].variantGuid).toEqual('SV0000004_116042722_r0390_1000')
})

test('getPairedFilteredSavedVariants', () => {
  const pairedSavedVariants = getPairedFilteredSavedVariants(
    STATE_WITH_2_FAMILIES, { match: { params:  {} } }
  )
  expect(pairedSavedVariants.length).toEqual(2)
  expect(pairedSavedVariants[0].variantGuid).toEqual('SV0000004_116042722_r0390_1000')
  expect(pairedSavedVariants[1].variantGuid).toEqual('SV0000002_1248367227_r0390_100')
})

test('getVisibleSortedSavedVariants', () => {
  const savedVariants = getVisibleSortedSavedVariants(
    STATE_WITH_2_FAMILIES, { match: { params:  {} } }
  )
  expect(savedVariants.length).toEqual(1)
  expect(savedVariants[0].variantGuid).toEqual('SV0000002_1248367227_r0390_100')
})

const RNA_SEQ_PHENOTYPE_PRIORITIZATION_STATE = {
  rnaSeqDataByIndividual: {
    I021476_na19678_1: {
      outliers: {
        ENSG00000228198: { isSignificant: true, pValue: 0.0004 },
        ENSG00000164458: { isSignificant: true, pValue: 0.0073 },
      },
    },
    I021474_na19679_1: {
      outliers: {
        ENSG00000228198: { isSignificant: true, pValue: 0.01 },
        ENSG00000164458: { isSignificant: false, pValue: 0.73 },
      },
    },
    I021476_na19678_2: { outliers: { ENSG00000228198: { isSignificant: true, pValue: 0.0214 } } },
  },
  phePriDataByIndividual: {
    I021476_na19678_1: {
      lirical: {
        ENSG00000228198: [{
          diseaseId: 'OMIM:618460',
          diseaseName: 'Khan-Khan-Katsanis syndrome',
          geneId: 'ENSG00000228198',
          rank: 1,
          scores: { compositeLR: 0.066, post_test_probability: 0 },
        }],
      },
    },
  },
  ...STATE_WITH_2_FAMILIES,
}

test('getSampleGeneDataByFamilyGene', () => {
  expect(getSampleGeneDataByFamilyGene(RNA_SEQ_PHENOTYPE_PRIORITIZATION_STATE)).toEqual({
    F011652_1: {
      rnaSeqData: {
        ENSG00000228198: {
          NA19678: [{ scores: { pValue: 0.0004 } }],
          NA19679_1: [{ scores: { pValue: 0.01 } }],
        },
        ENSG00000164458: {
          NA19678: [{ scores: { pValue: 0.0073 } }],
        },
      },
      phePriData: {
        lirical: {
          ENSG00000228198: {
            NA19678: [{
              diseaseId: 'OMIM:618460',
              diseaseName: 'Khan-Khan-Katsanis syndrome',
              geneId: 'ENSG00000228198',
              rank: 1,
              scores: { compositeLR: 0.066, post_test_probability: 0 },
            }],
          },
        },
      },
    },
    F011652_2: {
      rnaSeqData: {
        ENSG00000228198: { NA19678_2: [{ scores: { pValue: 0.0214 } }] },
      },
    },
  })
})
