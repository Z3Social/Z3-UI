import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import MissingIndicator from 'soapbox/components/missing_indicator';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  FileInput,
  Form,
  FormActions,
  FormGroup,
  HStack,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
} from 'soapbox/components/ui';

import { changeValue, submit, setUp } from '../../../actions/group_editor';

const messages = defineMessages({
  title: { id: 'groups.form.title', defaultMessage: 'Group title' },
  titlePlaceholder: { id: 'groups.form.title_placeholder', defaultMessage: 'Enter group title' },
  description: { id: 'groups.form.description', defaultMessage: 'Group description' },
  descriptionPlaceholder: { id: 'groups.form.description_placeholder', defaultMessage: 'What is this group about?' },
  coverImage: { id: 'groups.form.coverImage', defaultMessage: 'Banner image (optional)' },
  coverHint: { id: 'groups.form.coverHint', defaultMessage: 'Recommended size 1200x400 JPG, PNG or WEBP' },
  visibility: { id: 'groups.form.visibility', defaultMessage: 'Visibility' },
  visibilityPublic: { id: 'groups.form.visibility.public', defaultMessage: 'Public - anyone can see and join' },
  visibilityPrivate: { id: 'groups.form.visibility.private', defaultMessage: 'Private - anyone can see, but joining requires approval' },
  visibilityHidden: { id: 'groups.form.visibility.hidden', defaultMessage: 'Hidden - only members can see it' },
  update: { id: 'groups.form.update', defaultMessage: 'Save changes' },
  cancel: { id: 'groups.form.cancel', defaultMessage: 'Cancel' },
  heading: { id: 'groups.edit.heading', defaultMessage: 'Edit group' },
});

const mapStateToProps = (state, props) => ({
  group: state.getIn(['groups', props.params.id]),
  title: state.getIn(['group_editor', 'title']),
  description: state.getIn(['group_editor', 'description']),
  coverImage: state.getIn(['group_editor', 'coverImage']),
  visibility: state.getIn(['group_editor', 'visibility']),
  disabled: state.getIn(['group_editor', 'isSubmitting']),
});

const mapDispatchToProps = (dispatch, props) => ({
  onTitleChange: value => dispatch(changeValue('title', value)),
  onDescriptionChange: value => dispatch(changeValue('description', value)),
  onCoverImageChange: value => dispatch(changeValue('coverImage', value)),
  onVisibilityChange: value => dispatch(changeValue('visibility', value)),
  onSubmit: routerHistory => dispatch(submit(routerHistory)),
  setUp: group => dispatch(setUp(group, props.params.id)),
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
@withRouter
class Edit extends React.PureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverImage: PropTypes.object,
    visibility: PropTypes.string,
    disabled: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onTitleChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onDescriptionChange: PropTypes.func.isRequired,
    onCoverImageChange: PropTypes.func.isRequired,
    onVisibilityChange: PropTypes.func.isRequired,
    setUp: PropTypes.func.isRequired,
    history: PropTypes.object,
    params: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    if (props.group) props.setUp(props.group);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.group && this.props.group) {
      this.props.setUp(this.props.group);
    }
  }

  handleTitleChange = e => {
    this.props.onTitleChange(e.target.value);
  }

  handleDescriptionChange = e => {
    this.props.onDescriptionChange(e.target.value);
  }

  handleCoverImageChange = e => {
    this.props.onCoverImageChange(e.target.files[0] || null);
  }

  handleVisibilityChange = e => {
    this.props.onVisibilityChange(e.target.value);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.props.history);
  }

  render() {
    const { group, title, description, coverImage, visibility, disabled, intl, params: { id } } = this.props;

    if (typeof group === 'undefined') {
      return <Spinner />;
    } else if (group === false) {
      return <MissingIndicator />;
    }

    return (
      <Card variant='rounded' size='lg' className='bg-white dark:bg-slate-800 shadow-md'>
        <CardHeader backHref={`/groups/${id}`}>
          <CardTitle>
            <FormattedMessage id='groups.edit.heading' defaultMessage='Edit group' />
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Form onSubmit={this.handleSubmit}>
            <Stack space={4}>
              <FormGroup labelText={intl.formatMessage(messages.title)}>
                <Input
                  type='text'
                  value={title}
                  disabled={disabled}
                  onChange={this.handleTitleChange}
                  placeholder={intl.formatMessage(messages.titlePlaceholder)}
                  required
                />
              </FormGroup>

              <FormGroup labelText={intl.formatMessage(messages.description)}>
                <Textarea
                  value={description}
                  disabled={disabled}
                  onChange={this.handleDescriptionChange}
                  placeholder={intl.formatMessage(messages.descriptionPlaceholder)}
                  rows={4}
                />
              </FormGroup>

              <FormGroup labelText={intl.formatMessage(messages.visibility)}>
                <Select
                  value={visibility}
                  disabled={disabled}
                  onChange={this.handleVisibilityChange}
                >
                  <option value='public'>{intl.formatMessage(messages.visibilityPublic)}</option>
                  <option value='private'>{intl.formatMessage(messages.visibilityPrivate)}</option>
                  <option value='hidden'>{intl.formatMessage(messages.visibilityHidden)}</option>
                </Select>
              </FormGroup>

              <FormGroup
                labelText={intl.formatMessage(messages.coverImage)}
                hintText={intl.formatMessage(messages.coverHint)}
              >
                <FileInput
                  id='group_cover_image'
                  disabled={disabled}
                  accept='image/*'
                  onChange={this.handleCoverImageChange}
                />
                {coverImage && (
                  <Text size='sm' theme='muted' className='mt-1'>
                    {coverImage.name}
                  </Text>
                )}
              </FormGroup>

              <FormActions>
                <HStack space={2} justifyContent='end'>
                  <Link to={`/groups/${id}`}>
                    <Button theme='secondary' text={intl.formatMessage(messages.cancel)} disabled={disabled} />
                  </Link>
                  <Button
                    type='submit'
                    theme='primary'
                    text={intl.formatMessage(messages.update)}
                    disabled={disabled || !title.trim()}
                  />
                </HStack>
              </FormActions>
            </Stack>
          </Form>
        </CardBody>
      </Card>
    );
  }

}
