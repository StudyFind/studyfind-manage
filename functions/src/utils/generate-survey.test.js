const func = require('./generate-survey')

describe('generate-survey', () => {
    it('distinguishes inclusion and exclusion criteria', () => {
        let res = func(`Inclusion Criteria:\ni1\ni2\nExclusion Criteria:\ne1\ne2`)

        expect(res).not.toBeUndefined()
        expect(res).toStrictEqual({ inclusion: ['i1', 'i2'], exclusion: ['e1', 'e2'] })
    })

    it('combines criteria with subpoints', () => {
        let res = func(`Inclusion Criteria:\nSymptoms:\nSymptom1\nSymptom2\n\ni2\nExclusion Criteria:\ne1\ne2`)

        expect(res).toStrictEqual({ inclusion: ['Symptoms: Symptom1, Symptom2', 'i2'], exclusion: ['e1', 'e2'] })
    })

    it('handles real criteria without failing', () => {
        let res = func('Inclusion Criteria:\n\n\nA diagnosis of advanced COVID-19 as defined both of the following:\n\nas a positive test for SARS-CoV-2 RNA detected by RT-PCR collected from the upper respiratory tract (e.g. nasopharyngeal, nasal, oropharyngeal swab, or saliva) and, if possible, the lower respiratory tract (sputum, tracheal aspirate, or bronchoalveolar lavage), analyzed by a CLIA certified lab with an FDA approved assay.\n\nCritical disease manifested by any of the following:\n\nChest imaging with >= 50% lung involvement\nRespiratory failure requiring invasive mechanical ventilation, non-invasive mechanical ventilation (eg. BiPAPA, OptiFlow), supplementary oxygen with FiO2 >= 6 LPM or extracorporeal membrane oxygenation (ECMO)\nShock - defined as mean arterial pressure <= 65 mmHg unresponsive to 25ml/kg isotonic intravenous fluid resuscitation and/or requiring vasopressor support\n\nCardiac dysfunction defined by:\n\nNew global systolic dysfunction with ejection fraction <= 40%\nTakotsubo cardiomyopathy\n\n\n\n\n\n\nPatients who have received prior investigational or off-label agents for COVID-19 does not exclude eligibility.\nAt least 18 years of age at the time of study registration\nAdequate hematologic function defined as absolute neutrophil count >=1000/mm3 and platelet count >= 50,000/mm3 without growth factor or transfusion support for 7 days prior to screening.\nCreatinine-clearance >= 15 mL/minute or receiving renal replacement therapy\nAminotransferase (AST/ALT) levels <3x the upper limit of normal\nAble to understand and willing to sign an IRB approved written informed consent document (or that of legally authorized representative, if applicable)\nWomen of childbearing potential (defined as women with regular menses, women with amenorrhea, women with irregular cycles, women using a contraceptive method that precludes withdrawal bleeding, or women who have had a tubal ligation) are required to have a negative pregnancy test and use two forms of acceptable contraception, including one barrier method, during participation in the study treatment period.\nMale patients if engaging in sex with a women of childbearing potential are required to use two forms of acceptable contraception, including one barrier method, during participation in the study and throughout the evaluation period.\n\nExclusion Criteria:\n\nKnown allergy or intolerance to duvelisib or another PI3K inhibitor.\nKnown or suspected active viral (including CMV, HIV, hepatitis B, and hepatitis C), bacterial, mycobacterial, or fungal infection other than COVID-19. CMV viral load will be assessed at screening and those with viremia will be excluded. Other virologic testing not required unless infection is suspected.\nPregnant and/or breastfeeding.\nAny uncontrolled intercurrent illness that would put the patient at greater risk or limit compliance with study requirements in the opinion of the investigator.')

        expect(res.inclusion.length).toBeGreaterThan(0)
        expect(res.exclusion.length).toBeGreaterThan(0)
    })
})