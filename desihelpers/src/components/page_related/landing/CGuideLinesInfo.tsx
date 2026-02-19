import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { CH4Label } from "@/components/reusable/labels/CH4Label";
import { CH6Label } from "@/components/reusable/labels/CH6Label";
import style from "@/styles/Common.module.css";
import styles from "@/styles/UserProfiles.module.css";

interface SeekerStepsProps {
  isSeeker: boolean;
}

const SeekerSteps: React.FC<SeekerStepsProps> = ({ isSeeker }) => {
  const seekerSteps = [
    { step: 1, label: 'Login', icon: '/assets/icons/icon_login 1.svg', tooltip: 'Login' },
    { step: 2, label: 'Build Profile', icon: '/assets/icons/icon_user.svg', tooltip: 'Build Profile' },
    { step: 3, label: 'Save', icon: '/assets/icons/icon_thumb.svg', tooltip: 'Save' },
    { step: 4, label: 'Add Seeker Skills', icon: '/assets/icons/icon_skillset.svg', tooltip: 'Add Seeker Skills' },
    { step: 5, label: 'Save', icon: '/assets/icons/icon_thumb.svg', tooltip: 'Save' },
  ];

  const nonSeekerSteps = [
    { step: 1, label: 'Login', icon: '/assets/icons/icon_login 1.svg', tooltip: 'Login' },
    { step: 2, label: 'Build Profile', icon: '/assets/icons/icon_user.svg', tooltip: 'Build Profile' },
    { step: 3, label: 'Save', icon: '/assets/icons/icon_thumb.svg', tooltip: 'Save' },
    { step: 4, label: 'Become a Seeker', icon: '/assets/icons/icon_become_seeker_btn.svg', tooltip: 'Become a Seeker' },
    { step: 5, label: 'Confirm', icon: '/assets/icons/icon_thumb.svg', tooltip: 'Confirm' },
    { step: 6, label: 'Add Seeker Skills', icon: '/assets/icons/icon_skillset.svg', tooltip: 'Add Seeker Skills' },
    { step: 7, label: 'Save', icon: '/assets/icons/icon_thumb.svg', tooltip: 'Save' },
  ];

  const steps = isSeeker ? seekerSteps : nonSeekerSteps;

  return (
    <div>
      <div className="mb-4 d-flex justify-content-center">
        <CH4Label
          className={styles.pLabel}
          label={
            !isSeeker
              ? 'Follow the following steps to become a seeker'
              : 'Follow the following steps to add seeker skills set'
          }
        />
      </div>

      <div className="mb-4">
        <CH4Label
          label={
            <div className={styles.stepsWrapper}>
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className={styles.step}>
                    <CH6Label className="fw-bold" label={`Step ${step.step}`} />
                    <OverlayTrigger
                      placement="top"
                      trigger={['hover', 'focus', 'click']}
                      overlay={<Tooltip id={`tooltip-top-${index}`}>{step.tooltip}</Tooltip>}
                    >
                      <img src={step.icon} alt={`${step.label} Icon`} className={styles.infoIcons} />
                    </OverlayTrigger>
                    <CH6Label label={step.label} />
                  </div>
                  {index < steps.length - 1 && (
                    <img
                      src="/assets/icons/icon_arrowhead_right.svg"
                      alt=""
                      className={styles.infoIconsArrow}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default SeekerSteps;
