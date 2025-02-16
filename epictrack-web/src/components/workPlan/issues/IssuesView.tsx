import React from "react";
import AddIcon from "@mui/icons-material/Add";
import NoDataEver from "../../shared/NoDataEver";
import TrackDialog from "../../shared/TrackDialog";
import IssuesForm from "./IssuesForm";
import { IssuesContext } from "./IssuesContext";
import IssuesViewSkeleton from "./IssuesViewSkeleton";
import { Else, If, Then } from "react-if";
import IssueAccordion from "./IssueAccordion";
import { Button, Grid } from "@mui/material";
import { WorkplanContext } from "../WorkPlanContext";
import CloneUpdateForm from "./CloneForm";

const IssuesView = () => {
  const { issues } = React.useContext(WorkplanContext);
  const {
    showIssuesForm,
    setShowIssuesForm,
    isIssuesLoading,
    showCloneForm,
    setShowCloneForm,
    setUpdateToClone,
    updateToEdit,
    setUpdateToEdit,
  } = React.useContext(IssuesContext);

  const onAddButtonClickHandler = () => {
    setShowIssuesForm(true);
  };

  const handleIssueFormClose = () => {
    setShowIssuesForm(false);
    setUpdateToEdit(null);
  };

  const getDialogTitle = () => {
    if (updateToEdit) {
      return "Edit Issue";
    }
    return "Add Issue";
  };

  const lastInteractedIssue = React.useRef<number | null>(null);

  if (isIssuesLoading) {
    return <IssuesViewSkeleton />;
  }

  return (
    <>
      <If condition={issues.length === 0}>
        <Then>
          <NoDataEver
            title="You don't have any Issues yet"
            subTitle="Start adding your Issues"
            addNewButtonText="Add Issue"
            onAddNewClickHandler={() => onAddButtonClickHandler()}
          />
        </Then>
        <Else>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() => onAddButtonClickHandler()}
                startIcon={<AddIcon />}
              >
                Issue
              </Button>
            </Grid>
            {issues.map((issue, index) => (
              <Grid item xs={12}>
                <IssueAccordion
                  issue={issue}
                  defaultOpen={
                    lastInteractedIssue.current
                      ? issue.id === lastInteractedIssue.current
                      : index === 0
                  }
                  onInteraction={() => {
                    lastInteractedIssue.current = issue.id;
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Else>
      </If>
      <TrackDialog
        open={showIssuesForm}
        dialogTitle={getDialogTitle()}
        disableEscapeKeyDown
        fullWidth
        maxWidth="sm"
        okButtonText="Save"
        formId="issue-form"
        onClose={() => handleIssueFormClose()}
        onCancel={() => handleIssueFormClose()}
        isActionsRequired
      >
        <IssuesForm />
      </TrackDialog>
      <TrackDialog
        open={showCloneForm}
        dialogTitle={getDialogTitle()}
        disableEscapeKeyDown
        fullWidth
        maxWidth="sm"
        okButtonText="Save"
        formId="issue-form"
        onClose={() => {
          setShowCloneForm(false);
          setUpdateToClone(null);
        }}
        onCancel={() => {
          setShowCloneForm(false);
          setUpdateToClone(null);
        }}
        isActionsRequired
      >
        <CloneUpdateForm />
      </TrackDialog>
    </>
  );
};

export default IssuesView;
