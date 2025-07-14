// import { PDFDocument } from "pdf-lib";
// import fs from "fs";
// import path from "path";

// export async function POST(req) {
//   try {
//     /* ───────── 1. grab request data ───────── */
//     const userProfile = await req.json();

//     /* ───────── 2. load template ──────────── */
//     const templatePath = path.join(
//       process.cwd(),
//       "public/downloadables/OM_EstatePlanning_BlankReport.pdf"
//     );
//     const pdfBuffer = fs.readFileSync(templatePath);
//     const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBuffer));
//     const form = pdfDoc.getForm();

//     /* ───────── 3. helpers ─────────────────── */
//     const nA = (v) => (v ? v : "N/A");

//     const renderArrayAsBlob = (arr, cols) =>
//       Array.isArray(arr) && arr.length
//         ? arr
//             .map(
//               (row, i) =>
//                 `${i + 1}. ` +
//                 cols.map((c) => `${c}: ${nA(row?.[c])}`).join(" | ")
//             )
//             .join("\n")
//         : "N/A";

//     const flattenAdditionalConsiderations = (ac = {}) => ({
//       contactLegalAdviser: nA(ac.contactLegalAdviser),
//       legacyHeirlooms: nA(ac.legacyHeirlooms),
//       beneficiaryDesignations: nA(ac.beneficiaryDesignations),
//       executorRemuneration: nA(ac.executorRemuneration),
//       informedNominated: nA(ac.informedNominated),
//       prepaidFuneral: nA(ac.prepaidFuneral),
//       petCarePlanning: nA(ac.petCarePlanning),
//       setAReminder: nA(ac.setAReminder),
//     });

//     /* ───────── 4. text-field map (old + new) ───────── */
//     const textFields = {
//       /* --- existing fields (unchanged) --- */
//       name: nA(userProfile?.name),
//       propertyRegime: nA(userProfile?.propertyRegime),
//       email: nA(userProfile?.emailAddress),
//       birthday: nA(userProfile?.dateOfBirth),
//       maritalStatus: nA(userProfile?.maritalStatus),
//       estatePlanReviewConfidence: nA(
//         userProfile?.ObjectivesOfEstatePlanning?.estatePlanReviewConfidence
//       ),
//       businessProtectionImportance: nA(
//         userProfile?.ObjectivesOfEstatePlanning?.businessProtectionImportance
//       ),
//       insolvencyProtectionConcern: nA(
//         userProfile?.ObjectivesOfEstatePlanning?.insolvencyProtectionConcern
//       ),
//       taxMinimizationPriority: nA(
//         userProfile?.ObjectivesOfEstatePlanning?.taxMinimizationPriority
//       ),
//       additionalLifeInsuranceDependents_answer: nA(
//         userProfile?.ProvisionsDependents?.additionalLifeInsuranceDependents
//           ?.answer
//       ),
//       awarePotentialDonations_answer: nA(
//         userProfile?.Trusts?.awarePotentialDonations?.answer
//       ),
//       bequeathToSpouseCondition_answer: nA(
//         userProfile?.EstateDuty?.bequeathToSpouseCondition?.answer
//       ),
//       bequeathToSpousePercentage_answer: nA(
//         userProfile?.EstateDuty?.bequeathToSpousePercentage?.answer
//       ),
//       borrowingFundsForShortfall_answer: nA(
//         userProfile?.LiquidityPosition?.borrowingFundsForShortfall?.answer
//       ),
//       consideredSellingAssetTrust_answer: nA(
//         userProfile?.Trusts?.consideredSellingAssetTrust?.answer
//       ),
//       consideredSettingUpTrust_answer: nA(
//         userProfile?.Trusts?.consideredSettingUpTrust?.answer
//       ),
//       consideringDonatingTrust_answer: nA(
//         userProfile?.Trusts?.consideringDonatingTrust?.answer
//       ),
//       contingentLiabilityInsurance_answer: nA(
//         userProfile?.Policies?.contingentLiabilityInsurance?.answer
//       ),
//       creditCardDebt_dl: nA(
//         userProfile?.Liabilities?.creditCardDebt?.propertiesDetails
//       ),
//       disabilityInsuranceAwareness_answer: nA(
//         userProfile?.Policies?.disabilityInsuranceAwareness?.answer
//       ),
//       disabilityInsuranceType_answer: nA(
//         userProfile?.Policies?.disabilityInsuranceType?.answer
//       ),
//       estateBequeathDifference_answer: nA(
//         userProfile?.EstateDuty?.estateBequeathDifference?.answer
//       ),
//       estateBequeathProperty_answer: nA(
//         userProfile?.EstateDuty?.estateBequeathProperty?.answer
//       ),
//       estateBequeathResidue_answer: nA(
//         userProfile?.EstateDuty?.estateBequeathResidue?.answer
//       ),
//       estateBequeathToSpouse_answer: nA(
//         userProfile?.EstateDuty?.estateBequeathToSpouse?.answer
//       ),
//       estateBequeathToTrust_answer: nA(
//         userProfile?.EstateDuty?.estateBequeathToTrust?.answer
//       ),
//       incomeMaintenanceTax_answer: nA(
//         userProfile?.MaintenanceSurvivingSpouse?.incomeMaintenanceTax?.answer
//       ),
//       investmentTrustFlexibility_answer: nA(
//         userProfile?.InvestmentTrusts?.investmentTrustFlexibility?.answer
//       ),
//       keyPersonInsurance_answer: nA(
//         userProfile?.Policies?.keyPersonInsurance?.answer
//       ),
//       lifeAssuranceCashShortfall_answer: nA(
//         userProfile?.LiquidityPosition?.lifeAssuranceCashShortfall?.answer
//       ),
//       liquiditySources_answer: nA(
//         userProfile?.LiquidityPosition?.liquiditySources?.answer
//       ),
//       maintenanceClaimsAwareness_answer: nA(
//         userProfile?.MaintenanceClaims?.maintenanceClaimsAwareness?.answer
//       ),
//       maintenanceCostOfEducation_answer: nA(
//         userProfile?.MaintenanceClaims?.maintenanceCostOfEducation?.answer
//       ),
//       maintenanceInsurancePolicy_answer: nA(
//         userProfile?.MaintenanceClaims?.maintenanceInsurancePolicy?.answer
//       ),
//       noExecutorFeesPolicy_answer: nA(
//         userProfile?.ExecutorFees?.noExecutorFeesPolicy?.answer
//       ),
//       provideGuidanceFinancialInfo_answer: nA(
//         userProfile?.ProvisionsDependents?.provideGuidanceFinancialInfo?.answer
//       ),
//       provisionConsidered_answer: nA(
//         userProfile?.MaintenanceSurvivingSpouse?.provisionConsidered?.answer
//       ),
//       provisionsForSurvivingSpouse_answer: nA(
//         userProfile?.MaintenanceSurvivingSpouse?.provisionsForSurvivingSpouse
//           ?.answer
//       ),
//       reasonTrustRelevant_answer: nA(
//         userProfile?.Trusts?.reasonTrustRelevant?.answer
//       ),
//       reviewExistingProvisionsInfo_answer: nA(
//         userProfile?.MaintenanceSurvivingSpouse?.reviewExistingProvisionsInfo
//           ?.answer
//       ),
//       settingUpInvestmentTrust_answer: nA(
//         userProfile?.InvestmentTrusts?.settingUpInvestmentTrust?.answer
//       ),
//       shortfallHeirContribution_answer: nA(
//         userProfile?.LiquidityPosition?.shortfallHeirContribution?.answer
//       ),
//       shortfallHouseholdIncome_answer: nA(
//         userProfile?.ProvisionsDependents?.shortfallHouseholdIncome?.answer
//       ),
//       trustAdvantages_answer: nA(
//         userProfile?.Trusts?.trustAdvantages?.answer
//       ),

//       /* --- NEW scalar fields from additionalConsideration --- */
//       ...flattenAdditionalConsiderations(
//         userProfile?.additionalConsideration
//       ),

//       /* --- NEW array blobs --- */
//       donationsDetails_blob: renderArrayAsBlob(
//         userProfile?.estateToolsV2?.donationsDetails,
//         ["description", "value", "recipient", "notes"]
//       ),
//       legacyHeirloomsDetails_blob: renderArrayAsBlob(
//         userProfile?.additionalConsideration?.legacyHeirloomsDetails,
//         ["item", "recipient"]
//       ),
//     };

//     /* write all the text fields (ignore missing IDs quietly) */
//     for (const [field, value] of Object.entries(textFields)) {
//       try {
//         form.getTextField(field).setText(String(value));
//       } catch {
//         /* field id doesn’t exist in template – skip */
//       }
//     }

//     /* ───────── 5. checkmarks (unchanged) ───────── */
//     const dependantFields = {
//       spouse: userProfile?.dependants?.spouse,
//       grandchildren: userProfile?.dependants?.grandChildren,
//       children: userProfile?.dependants?.children,
//       factualdependents: userProfile?.dependants?.factualDependents,
//       stepchildren: userProfile?.dependants?.stepChildren,
//       otherDependents: userProfile?.dependants?.other,
//     };
//     for (const [id, val] of Object.entries(dependantFields)) {
//       if (val) form.getTextField(id).setText("X");
//     }

//     /* other checkbox fields – keep your old list as-is */
//     const otherCheckFields = {
//       currentWill: userProfile?.will,
//       farm: userProfile?.ownFarm,
//       trust: userProfile?.templatesDownloaded?.trust,
//       investmentPortfolio: userProfile?.ownInvestmentPortfolio,
//       business: userProfile?.asset?.businessInterests,
//       retirementFund: userProfile?.ownRetirementFund,
//       establishTrust: userProfile?.Trusts?.consideredSettingUpTrust?.answer,
//       buySellAgreement: userProfile?.Policies?.buySellInsurance?.answer,
//       businessSuccessionPlanning: userProfile?.ownBusiness,
//       separationPersonal: userProfile?.asset?.personalProperty,
//       setUpInsurance: userProfile?.Policies?.setUpInsurance,
//       contingentLiabilityInsurance:
//         userProfile?.Policies?.contingentLiabilityInsurance?.answer,
//       debtRepaymentPlan:
//         userProfile?.Liabilities?.strategyLiabilities?.propertiesDetails,
//       legalAgreements: userProfile?.asset?.legalAgreements,
//       diversifiedInvestment:
//         userProfile?.InvestmentsPortfolio?.stocksEquities?.details,
//       assetProtectionPlanning:
//         userProfile?.ObjectivesOfEstatePlanning?.financialSafeguardStrategies,
//       /* … all other existing checkbox mappings … */
//       disabilityInsurance_up: userProfile?.Policies?.disabilityInsurance?.answer,
//       /* add new checkbox IDs here if your template has them */
//     };
//     for (const [id, val] of Object.entries(otherCheckFields)) {
//       if (val) form.getTextField(id).setText("X");
//     }

//     /* ───────── 6. output PDF ───────── */
//     const pdfBytes = await pdfDoc.save();
//     return new Response(pdfBytes, {
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition":
//           'attachment; filename="filled_estate_planning_report.pdf"',
//       },
//     });
//   } catch (err) {
//     console.error("Error generating PDF:", err);
//     return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
//       status: 500,
//     });
//   }
// }




















import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import connectMongoDB from '../../lib/mongo';
import UserProfile from '../../models/UserProfile';

export async function POST(req) {
  try {
    /* 1️⃣  Parse client payload (we just use it for auth) */
    const body = await req.json();
    const { auth } = body || {};
    if (!auth) {
      return new Response(JSON.stringify({ error: 'Missing auth token' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    /* 2️⃣  Fetch user from DB */
    await connectMongoDB();
    const user = await UserProfile.findOne({ auth }).lean();
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    /* 3️⃣  Create fresh PDF */
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    /* helpers */
    let y = height - 50;
    const left = 50;
    const line = 15;

    const drawLine = (txt, isBold = false) => {
      let p = pdfDoc.getPages().at(-1);
      if (y < 60) {
        p = pdfDoc.addPage();
        y = height - 50;
      }
      p.drawText(String(txt), {
        x: left,
        y,
        size: 11,
        font: isBold ? bold : font,
        color: rgb(0, 0, 0),
      });
      y -= line;
    };

    const drawTable = (headers, rows) => {
      const colW = (width - left * 2) / headers.length;
      const rowH = line + 6;
      const pad = 3;
      let p = pdfDoc.getPages().at(-1);

      // header
      headers.forEach((h, i) => {
        p.drawRectangle({
          x: left + i * colW,
          y: y - rowH,
          width: colW,
          height: rowH,
          borderWidth: 1,
          borderColor: rgb(0, 0, 0),
          color: rgb(1, 1, 1),
        });
        p.drawText(h, {
          x: left + i * colW + pad,
          y: y - rowH + rowH / 2 - 4,
          size: 11,
          font,
          color: rgb(0, 0, 0),
        });
      });
      y -= rowH;

      rows.forEach((r) => {
        if (y < 60) {
          p = pdfDoc.addPage();
          y = height - 50;
        }
        headers.forEach((_, i) => {
          p.drawRectangle({
            x: left + i * colW,
            y: y - rowH,
            width: colW,
            height: rowH,
            borderWidth: 1,
            borderColor: rgb(0, 0, 0),
            color: rgb(1, 1, 1),
          });
          p.drawText(String(r[i] ?? 'N/A'), {
            x: left + i * colW + pad,
            y: y - rowH + rowH / 2 - 4,
            size: 10,
            font,
            color: rgb(0, 0, 0),
          });
        });
        y -= rowH;
      });
      y -= 6;
    };

    const boldHdrs = new Set([
      'Net Worth Assessment / Estate Profile',
      'Estate Planning Goals',
      'Estate Planning Tools',
      'Tax Planning',
      'Business Succession Planning',
      'Living Will / Healthcare Directive',
      'Foreign Assets',
      'Additional Considerations',
    ]);

    /* 4️⃣  Build PDF content ------------------------------------------------ */

    const lines = [
      `Estate Plan Summary for ${user.name || 'N/A'}`,
      '',
      `What's your full name?: ${user.name || 'N/A'}`,
      `What’s your marital status?: ${user.maritalStatus || 'N/A'}`,
      `Do you have any children or dependents?: ${
        user.childrenOrDependents?.hasDependents || 'N/A'
      }`,
      `If yes, provide details about dependents: ${
        user.childrenOrDependents?.details || 'N/A'
      }`,
      `Have you named a guardian for your minor children in your will?: ${
        user.guardianNamed || 'N/A'
      }`,
      `What are your main goals for your estate plan?: ${
        user.estatePlanGoals || 'N/A'
      }`,
      '',
      'Net Worth Assessment / Estate Profile',
      `Do you own any property (house, land, apartment)?: ${
        user.estateProfileV2?.ownsProperty || 'N/A'
      }`,
      `Property details and estimated value: ${
        user.estateProfileV2?.propertyDetails || 'N/A'
      }`,
      `Do you own any vehicles (car, motorcycle, boat)?: ${
        user.estateProfileV2?.ownsVehicle || 'N/A'
      }`,
      `Vehicle details and estimated value: ${
        user.estateProfileV2?.vehicleDetails || 'N/A'
      }`,
      `Do you own a business or are a partner in one?: ${
        user.estateProfileV2?.ownsBusiness || 'N/A'
      }`,
      `Business details: ${user.estateProfileV2?.businessDetails || 'N/A'}`,
      `Do you own any valuable items (artwork, jewellery, etc.)?: ${
        user.estateProfileV2?.ownsValuables || 'N/A'
      }`,
      `Valuable item details: ${
        user.estateProfileV2?.valuableDetails || 'N/A'
      }`,
      `Do you have any debts?: ${user.estateProfileV2?.hasDebts || 'N/A'}`,
      `Debt details: ${user.estateProfileV2?.debtDetails || 'N/A'}`,
      '',
      'Estate Planning Goals',
      `How should your assets be distributed?: ${
        user.estateGoalsV2?.assetDistribution || 'N/A'
      }`,
      `Want to provide for your dependents?: ${
        user.estateGoalsV2?.careForDependents || 'N/A'
      }`,
      `Want to minimize estate taxes?: ${
        user.estateGoalsV2?.minimizeTaxes || 'N/A'
      }`,
      `Do you want a business succession plan?: ${
        user.estateGoalsV2?.businessSuccession || 'N/A'
      }`,
      `Do you want an incapacity plan?: ${
        user.estateGoalsV2?.incapacityPlanning || 'N/A'
      }`,
      `Do you have an emergency fund?: ${
        user.estateGoalsV2?.emergencyFund || 'N/A'
      }`,
      `Do you have a financial/retirement plan?: ${
        user.estateGoalsV2?.financialPlan || 'N/A'
      }`,
      '',
      'Estate Planning Tools',
      `Do you have a will or want to create one?: ${
        user.estateToolsV2?.will || 'N/A'
      }`,
      `Do you want to review/update your will?: ${
        user.estateToolsV2?.willReview || 'N/A'
      }`,
      `Would you like to set up a trust?: ${
        user.estateToolsV2?.trustSetup || 'N/A'
      }`,
      `Would you like to make donations during your lifetime?: ${
        user.estateToolsV2?.donations || 'N/A'
      }`,
      `Want to review donation implications?: ${
        user.estateToolsV2?.donationsProceedReview || 'N/A'
      }`,
    ];

    lines.forEach((ln) => drawLine(ln, boldHdrs.has(ln)));

    /* selected trusts table */
    if (user.estateToolsV2?.trusts?.length) {
      drawLine('');
      drawLine('Selected Trusts:', true);
      drawTable(['Trust'], user.estateToolsV2.trusts.map((t) => [t]));
    }

    /* donationsDetails table */
    if (user.estateToolsV2?.donationsDetails?.length) {
      drawLine('');
      drawLine('Donation Details:', true);
      drawTable(
        ['Description', 'Value', 'Recipient', 'Notes'],
        user.estateToolsV2.donationsDetails.map((d) => [
          d.description || 'N/A',
          d.value || 'N/A',
          d.recipient || 'N/A',
          d.notes || 'N/A',
        ])
      );
    }

    /* rest of scalar lines */
    const moreLines = [
      '',
      `Use life insurance to fund expenses or support family?: ${
        user.estateToolsV2?.lifeInsurance || 'N/A'
      }`,
      `If yes, insurer and insured amount: ${
        user.estateToolsV2?.lifeInsuranceDetails || 'N/A'
      }`,
      `If no insurance, how will you cover estate expenses?: ${
        user.estateToolsV2?.estateExpensePlan || 'N/A'
      }`,
      `Marriage property status (Shared/Separate): ${
        user.estateToolsV2?.marriagePropertyStatus || 'N/A'
      }`,
      `Do you have digital assets (online accounts, crypto)?: ${
        user.estateToolsV2?.digitalAssets || 'N/A'
      }`,
      `Details about digital assets planning: ${
        user.estateToolsV2?.digitalAssetsDetails || 'N/A'
      }`,
      '',
      'Tax Planning',
      `Want help reducing estate duty?: ${
        user.estateTaxV2?.estateDuty || 'N/A'
      }`,
      `Do you own taxable assets (e.g., investments)?: ${
        user.estateTaxV2?.gainsTax || 'N/A'
      }`,
      `Aware of income taxes that apply to your estate?: ${
        user.estateTaxV2?.incomeTax || 'N/A'
      }`,
      `Are there people who could make claims on your estate?: ${
        user.estateTaxV2?.protectionClaims || 'N/A'
      }`,
      '',
      'Business Succession Planning',
      `Do you have a business succession plan?: ${
        user.businessV2?.businessPlan || 'N/A'
      }`,
      '',
      'Living Will / Healthcare Directive',
      `Would you like to create a Living Will?: ${
        user.livingWillV2?.createLivingWill || 'N/A'
      }`,
      `Do you need to name someone for healthcare decisions?: ${
        user.livingWillV2?.healthCareDecisions || 'N/A'
      }`,
      '',
      'Foreign Assets',
      `Do you own property, accounts, or investments in another country?: ${
        user.reviewForeignAssetsV2?.ownProperty || 'N/A'
      }`,
      '',
      'Additional Considerations',
      `Would you like a legal adviser to contact you?: ${
        user.additionalConsideration?.contactLegalAdviser || 'N/A'
      }`,
      `Do you have heirlooms to pass on?: ${
        user.additionalConsideration?.legacyHeirlooms || 'N/A'
      }`,
    ];
    moreLines.forEach((ln) => drawLine(ln, boldHdrs.has(ln)));

    /* heirloom table */
    if (user.additionalConsideration?.legacyHeirloomsDetails?.length) {
      drawLine('');
      drawLine('Legacy Heirlooms:', true);
      drawTable(
        ['Item', 'Recipient'],
        user.additionalConsideration.legacyHeirloomsDetails.map((h) => [
          h.item || 'N/A',
          h.recipient || 'N/A',
        ])
      );
    }

    const finalLines = [
      '',
      `Have you updated beneficiary designations?: ${
        user.additionalConsideration?.beneficiaryDesignations || 'N/A'
      }`,
      `Have you named an executor and understand their compensation?: ${
        user.additionalConsideration?.executorRemuneration || 'N/A'
      }`,
      `Have you informed your nominated executor?: ${
        user.additionalConsideration?.informedNominated || 'N/A'
      }`,
      `Do you have a prepaid funeral plan?: ${
        user.additionalConsideration?.prepaidFuneral || 'N/A'
      }`,
      `Do you have pets and planned their care?: ${
        user.additionalConsideration?.petCarePlanning || 'N/A'
      }`,
      `Would you like to set a reminder to review your plan?: ${
        user.additionalConsideration?.setAReminder || 'N/A'
      }`,
    ];
    finalLines.forEach((ln) => drawLine(ln, boldHdrs.has(ln)));

    /* 5️⃣  stream PDF back */
    const bytes = await pdfDoc.save();
    return new Response(bytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${user.name || 'EstatePlan'}_Summary.pdf"`,
      },
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to generate PDF' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
