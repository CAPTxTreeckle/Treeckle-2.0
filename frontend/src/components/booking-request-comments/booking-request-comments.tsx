import React from "react";
import { Button, Comment, Form, Header } from "semantic-ui-react";
import {
  useCreateBookingRequestComment,
  useGetBookingRequestComments,
} from "../../custom-hooks/api/comment-api";
import PlaceholderWrapper from "../placeholder-wrapper";
import defaultAvatarImage from "../../assets/avatar.png";
import "./booking-request-comments.scss";
import { displayDatetime } from "../../utils/parser";

interface Props {
  bookingRequestId: number;
}

function BookingRequestComments({ bookingRequestId }: Props) {
  const [replyContent, setReplyContent] = React.useState("");
  const {
    bookingRequestComments,
    isLoading,
    getComments,
  } = useGetBookingRequestComments();

  const {
    createBookingRequestComment,
    isLoading: isCreating,
  } = useCreateBookingRequestComment();

  React.useEffect(() => {
    getComments(bookingRequestId);
  }, [getComments, bookingRequestId]);

  async function handleSubmit() {
    const trimmedReplyContent = replyContent.trim();
    if (trimmedReplyContent === "") {
      setReplyContent("");
      return;
    }
    setReplyContent("");
    await createBookingRequestComment(bookingRequestId, trimmedReplyContent);
    await getComments(bookingRequestId);
  }

  return (
    <div className="booking-request-comments-container">
      <PlaceholderWrapper
        isLoading={isLoading || isCreating}
        loadingMessage="Retrieving comments"
        showDefaultMessage={bookingRequestComments.length === 0}
        defaultMessage="There are no comments for this booking request."
        placeholder
        inverted
        withDimmer
      >
        <Comment.Group>
          <Header as="h3" dividing>
            Comments
          </Header>

          {bookingRequestComments.map((comment) => (
            <Comment>
              <Comment.Avatar src={defaultAvatarImage} />
              <Comment.Content>
                <Comment.Author as="a">{comment.name}</Comment.Author>
                <Comment.Metadata>
                  {displayDatetime(comment.createdAt)}
                </Comment.Metadata>
                <Comment.Text>{comment.content}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </PlaceholderWrapper>
      <Form reply onSubmit={handleSubmit} className="comments">
        <Form.TextArea
          value={replyContent}
          onChange={(_event, data) => setReplyContent(data.value as string)}
          label="Add comments for this booking request"
        />
        <Button
          type="submit"
          content="Reply"
          labelPosition="left"
          icon="edit"
          primary
          className="booking-request-comments-button"
        />
      </Form>
    </div>
  );
}

export default BookingRequestComments;
