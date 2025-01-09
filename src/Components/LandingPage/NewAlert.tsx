import React, { useState } from 'react';

import {
  Alert,
  AlertActionCloseButton,
  AlertActionLink,
  Flex,
  FlexItem,
  Text,
} from '@patternfly/react-core';
// Import for optional quickstarts functionality
// import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

type NewAlertPropTypes = {
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NewAlert = ({ setShowAlert }: NewAlertPropTypes) => {
  // Hide the alert until needed again
  // const isAlertDismissed = window.localStorage.getItem(
  //   'imageBuilder.newFeatureAlertDismissed'
  // );
  const [displayAlert, setDisplayAlert] = useState(false); // when needed switch for !isAlertDismissed);

  const dismissAlert = () => {
    setDisplayAlert(false);
    window.localStorage.setItem(
      'imageBuilder.newFeatureNewStepsAlertDismissed',
      'true'
    );
  };

  // Optional quickstarts functionality
  // const { quickStarts } = useChrome();
  // const activateQuickstart = (qs: string) => () =>
  //   quickStarts.activateQuickstart(qs);

  if (displayAlert) {
    return (
      <Alert
        style={{ margin: '0 0 16px 0' }}
        title="New in Images: TITLE PLACEHOLDER"
        actionClose={<AlertActionCloseButton onClose={dismissAlert} />}
        actionLinks={
          <>
            <Flex>
              <FlexItem>
                {/* Optional quickstarts link
                  <AlertActionLink
                    onClick={activateQuickstart(
                      'insights-creating-blueprint-images'
                    )}
                  >
                    Get started with blueprints
                  </AlertActionLink>
                */}
              </FlexItem>
              <FlexItem>
                <AlertActionLink onClick={() => setShowAlert(false)}>
                  Not now
                </AlertActionLink>
              </FlexItem>

              <FlexItem align={{ default: 'alignRight' }}>
                <AlertActionLink onClick={dismissAlert}>
                  Don&apos;t show me this again
                </AlertActionLink>
              </FlexItem>
            </Flex>
          </>
        }
      >
        <Text>Placeholder</Text>
      </Alert>
    );
  } else {
    return;
  }
};
