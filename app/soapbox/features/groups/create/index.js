import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

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
  Stack,
  Text,
  Textarea,
} from 'soapbox/components/ui';

import { changeValue, submit, reset } from '../../../actions/group_editor';

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
  create: { id: 'groups.form.create', defaultMessage: 'Create group' },
  cancel: { id: 'groups.form.cancel', defaultMessage: 'Cancel' },
  heading: { id: 'groups.create.heading', defaultMessage: 'Create a new group' },
});

const mapStateToProps = state => ({
  title: state.getIn(['group_editor', 'title']),
  description: state.getIn(['group_editor', 'description']),
  coverImage: state.getIn(['group_editor', 'coverImage']),
  visibility: state.getIn(['group_editor', 'visibility']),
  disabled: state.getIn(['group_editor', 'isSubmitting']),
});

const mapDispatchToProps = dispatch => ({
  onTitleChange: value => dispatch(changeValue('title', value)),
  onDescriptionChange: value => dispatch(changeValue('description', value)),
  onCoverImageChange: value => dispatch(changeValue('coverImage', value)),
  onVisibilityChange: value => dispatch(changeValue('visibility', value)),
  onSubmit: routerHistory => dispatch(submit(routerHistory)),
  reset: () => dispatch(reset()),
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
@withRouter
class Create extends React.PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverImage: PropTypes.object,
    visibility: PropTypes.string,
    disabled: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onTitleChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    onDescriptionChange: PropTypes.func.isRequired,
    onCoverImageChange: PropTypes.func.isRequired,
    onVisibilityChange: PropTypes.func.isRequired,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);
    props.reset();
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
    const { title, description, coverImage, visibility, disabled, intl } = this.props;

    return (
      <Card variant='rounded' size='lg' className='bg-white dark:bg-slate-800 shadow-md'>
        <CardHeader backHref='/groups'>
          <CardTitle>
            <FormattedMessage id='groups.create.heading' defaultMessage='Create a new group' />
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
                  <Link to='/groups'>
                    <Button theme='secondary' text={intl.formatMessage(messages.cancel)} disabled={disabled} />
                  </Link>
                  <Button
                    type='submit'
                    theme='primary'
                    text={intl.formatMessage(messages.create)}
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
