import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, FormControlLabel, Grid, Stack, Tooltip } from "@mui/material";
import ControlledTextField from "../../shared/controlledInputComponents/ControlledTextField";
import { ETFormLabelWithCharacterLimit, ETParagraph } from "../../shared";
import ControlledSwitch from "../../shared/controlledInputComponents/ControlledSwitch";
import { IssuesContext } from "./IssuesContext";
import { IconProps } from "../../icons/type";
import Icons from "../../icons";
import { IssueForm } from "./types";
import moment from "moment";
import ControlledDatePicker from "../../shared/controlledInputComponents/ControlledDatePicker";
import { WorkplanContext } from "../WorkPlanContext";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  is_active: yup.boolean(),
  is_high_priority: yup.boolean(),
  start_date: yup.string().required("Start date is required"),
  expected_resolution_date: yup.string().nullable(),
});

const InfoIcon: React.FC<IconProps> = Icons["InfoIcon"];

const IssuesForm = () => {
  const {
    setShowIssuesForm,
    addIssue,
    updateIssue,
    updateToEdit,
    setUpdateToEdit,
  } = React.useContext(IssuesContext);

  const { issues } = React.useContext(WorkplanContext);

  const methods = useForm<IssueForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      description_id: null,
      is_active: true,
      is_high_priority: false,
      start_date: "",
      expected_resolution_date: "",
    },
    mode: "onSubmit",
  });

  const { handleSubmit, watch, reset } = methods;

  const loadForm = () => {
    if (!updateToEdit) return;

    const issueToEdit = issues.find(
      (issue) => issue.id === updateToEdit.work_issue_id
    );

    if (!issueToEdit) return;

    reset({
      title: issueToEdit.title,
      description: updateToEdit.description,
      is_active: issueToEdit.is_active,
      is_high_priority: issueToEdit.is_high_priority,
      start_date: issueToEdit.start_date,
      expected_resolution_date: issueToEdit.expected_resolution_date,
    });
  };
  useEffect(() => {
    loadForm();
  }, [updateToEdit]);

  const watchedTitle = watch("title");
  const titleCharacterLimit = 50;
  const watchedDescription = watch("description");
  const descriptionCharacterLimit = 250;

  const saveIssue = (issueForm: IssueForm) => {
    if (updateToEdit) {
      return updateIssue(issueForm);
    }
    return addIssue(issueForm);
  };

  const onSubmitHandler = async (data: IssueForm) => {
    const {
      title,
      description,
      start_date,
      expected_resolution_date,
      is_active,
      is_high_priority,
    } = await schema.validate(data);

    const dataToBeSubmitted = {
      title,
      description,
      start_date: moment(start_date).format(),
      expected_resolution_date: expected_resolution_date
        ? moment(expected_resolution_date).format()
        : undefined,
      is_active: Boolean(is_active),
      is_high_priority: Boolean(is_high_priority),
    };

    saveIssue(dataToBeSubmitted);
    setShowIssuesForm(false);
    setUpdateToEdit(null);
  };

  return (
    <FormProvider {...methods}>
      <Grid
        component={"form"}
        id="issue-form"
        spacing={2}
        container
        sx={{
          width: "100%",
        }}
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <Grid item xs={12}>
          <ETFormLabelWithCharacterLimit
            characterCount={watchedTitle.length}
            maxCharacterLength={titleCharacterLimit}
          >
            Title
          </ETFormLabelWithCharacterLimit>
          <ControlledTextField
            name="title"
            fullWidth
            size="small"
            inputProps={{
              maxLength: titleCharacterLimit,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ETFormLabelWithCharacterLimit
            characterCount={watchedDescription.length}
            maxCharacterLength={descriptionCharacterLimit}
          >
            Description
          </ETFormLabelWithCharacterLimit>
          <ControlledTextField
            name="description"
            fullWidth
            size="small"
            inputProps={{
              maxLength: descriptionCharacterLimit,
            }}
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <FormControlLabel
              control={<ControlledSwitch name="is_active" />}
              label={
                <Stack direction="row" spacing={1}>
                  <ETParagraph>Active</ETParagraph>
                  <Tooltip title="Issue must be active to appear on reports">
                    <Box component={"span"}>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Stack>
              }
            />
            <FormControlLabel
              control={<ControlledSwitch name="is_high_priority" />}
              label={
                <Stack direction="row" spacing={1}>
                  <ETParagraph>High Priority</ETParagraph>
                  <Tooltip title="Issue must be High Priority to appear on 30-60-90">
                    <Box component={"span"}>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Stack>
              }
            />
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <ETParagraph bold>Start Date</ETParagraph>
          <ControlledDatePicker name="start_date" />
        </Grid>
        <Grid item xs={6}>
          <ETParagraph bold>Expected Resolution Date</ETParagraph>
          <ControlledDatePicker name="expected_resolution_date" />
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default IssuesForm;
