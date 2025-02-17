import React, { useCallback, useState } from 'react';
import capitalize from 'lodash-es/capitalize';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { ArrowLeft } from '@carbon/react/icons';
import { age, formatDate, parseDate, useLayoutType, usePatient, useSession } from '@openmrs/esm-framework';
import { DefaultWorkspaceProps, launchPatientWorkspace, OrderBasketItem } from '@openmrs/esm-patient-common-lib';
import { LabOrderBasketItem } from '../api';
import styles from './add-lab-order.scss';
import { TestTypeSearch } from './test-type-search';
import { LabOrderForm } from './lab-order-form';

export interface AddLabOrderWorkspaceAdditionalProps {
  order?: OrderBasketItem;
}

export interface AddLabOrderWorkspace extends DefaultWorkspaceProps, AddLabOrderWorkspaceAdditionalProps {}

// Design: https://app.zeplin.io/project/60d5947dd636aebbd63dce4c/screen/640b06c440ee3f7af8747620
export default function AddLabOrderWorkspace({ order: initialOrder, closeWorkspace }: AddLabOrderWorkspace) {
  const { t } = useTranslation();

  const { patient, isLoading: isLoadingPatient } = usePatient();
  const [currentLabOrder, setCurrentLabOrder] = useState(initialOrder as LabOrderBasketItem);

  const isTablet = useLayoutType() === 'tablet';

  const patientName = `${patient?.name?.[0]?.given?.join(' ')} ${patient?.name?.[0].family}`;

  const cancelOrder = useCallback(() => {
    closeWorkspace();
    launchPatientWorkspace('order-basket');
  }, [closeWorkspace]);

  return (
    <div className={styles.container}>
      {isTablet && !isLoadingPatient && (
        <div className={styles.patientHeader}>
          <span className={styles.bodyShort02}>{patientName}</span>
          <span className={`${styles.text02} ${styles.bodyShort01}`}>
            {capitalize(patient?.gender)} &middot; {age(patient?.birthDate)} &middot;{' '}
            <span>{formatDate(parseDate(patient?.birthDate), { mode: 'wide', time: false })}</span>
          </span>
        </div>
      )}
      {!isTablet && (
        <div className={styles.backButton}>
          <Button
            kind="ghost"
            renderIcon={(props) => <ArrowLeft size={24} {...props} />}
            iconDescription="Return to order basket"
            size="sm"
            onClick={cancelOrder}
          >
            <span>{t('backToOrderBasket', 'Back to order basket')}</span>
          </Button>
        </div>
      )}
      {!currentLabOrder ? (
        <TestTypeSearch openLabForm={setCurrentLabOrder} />
      ) : (
        <LabOrderForm initialOrder={currentLabOrder} closeWorkspace={closeWorkspace} />
      )}
    </div>
  );
}
