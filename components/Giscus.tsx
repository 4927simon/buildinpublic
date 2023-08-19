import { useContext, useEffect, useState } from 'react';
import { AuthContext, ConfigContext } from '../lib/context';
import { useGiscusTranslation } from '../lib/i18n';
import { emitData } from '../lib/messages';
import { CommentOrder, IMetadataMessage } from '../lib/types/giscus';
import { useFrontBackDiscussion } from '../services/giscus/discussions';
import Comment from './Comment';
import CommentBox from './CommentBox';
import ReactButtons from './ReactButtons';

interface IGiscusProps {
  onDiscussionCreateRequest?: () => Promise<string>;
  onError?: (message: string) => void;
}

export default function Giscus({ onDiscussionCreateRequest, onError }: IGiscusProps) {
  const { token, origin } = useContext(AuthContext);
  const { t } = useGiscusTranslation();
  const {
    repo,
    term,
    number,
    category,
    strict,
    reactionsEnabled,
    emitMetadata,
    inputPosition,
    defaultCommentOrder,
  } = useContext(ConfigContext);
  const [orderBy, setOrderBy] = useState<CommentOrder>(defaultCommentOrder);
  const query = { repo, term, category, number, strict };

  const { addNewComment, updateReactions, increaseSize, backMutators, frontMutators, ...data } =
    useFrontBackDiscussion(query, token, orderBy);

  useEffect(() => {
    if (data.error && onError) {
      onError(data.error?.message);
    }
  }, [data.error, onError]);

  useEffect(() => {
    if (!emitMetadata || !data.discussion.id) return;
    const message: IMetadataMessage = {
      discussion: data.discussion,
      viewer: data.viewer,
    };
    emitData(message, origin);
  }, [data.discussion, data.viewer, emitMetadata, origin]);

  useEffect(() => {
    import('../lib/vendor/math-renderer-element');
  }, []);

  const handleDiscussionCreateRequest = async () => {
    const id = await onDiscussionCreateRequest();
    // Force revalidate
    frontMutators.mutate();
    backMutators.mutate();
    return id;
  };

  const mainCommentBox = (
    <CommentBox
      discussionId={data.discussion.id}
      context={repo}
      onSubmit={addNewComment}
      onDiscussionCreateRequest={handleDiscussionCreateRequest}
    />
  );

  const shouldCreateDiscussion = data.isNotFound && !number;
  const shouldShowBranding = !!data.discussion.url;

  const shouldShowCommentBox =
    (data.isRateLimited && !token) ||
    (!data.isLoading && !data.isLocked && (!data.error || (data.isNotFound && !number)));

  if (data.isLoading) {
    return (
      <div className="gsc-loading">
        <div className="gsc-loading-image" />
        <span className="gsc-loading-text color-fg-muted">{t('loadingComments')}</span>
      </div>
    );
  }

  return (
    <div className="color-text-primary gsc-main">
      {reactionsEnabled && !data.isLoading && (shouldCreateDiscussion || !data.error) ? (
        <div className="gsc-reactions">
          <h4 className="gsc-reactions-count">
            {shouldCreateDiscussion && !data.reactionCount ? (
              t('reactions', { count: 0 })
            ) : (
              <span className="color-text-primary">
                {t('reactions', { count: data.reactionCount || 0 })}
              </span>
            )}
          </h4>
          <div className="flex flex-auto items-center justify-center gap-2 text-sm mt-2">
            <ReactButtons
              subjectId={data.discussion.id}
              reactionGroups={data.discussion.reactions}
              onReact={updateReactions}
              onDiscussionCreateRequest={handleDiscussionCreateRequest}
            />
          </div>
        </div>
      ) : null}

      <div className="gsc-comments">
        <div className="gsc-header">
          <div className="gsc-left-header pl-2 pb-2">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="animate-ping transition duration-1000 delay-1000 ease-in-out absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <h4 className="gsc-comments-count">
              {shouldCreateDiscussion && !data.totalCommentCount ? (
                t('people are building in public today', { count: 0 })
              ) : data.error && !data.backData ? (
                t('genericError', { message: data.error?.message || '' })
              ) : (
                <a
                  href={data.discussion.url}
                  target="_blank"
                  rel="noreferrer noopener nofollow"
                  className="color-text-primary"
                >
                  {t('people are building in public today', { count: data.totalCommentCount })}
                </a>
              )}
            </h4>
            {shouldShowBranding ? (
              <>
                <div className="hidden lg:block">
                  <span className="color-text-secondary text-sm px-1">•</span>
                  <div className="color-text-secondary text-sm">Share your progress</div>
                </div>
              </>
            ) : null}
          </div>
          {data.totalCommentCount > 0 ? (
            <ul className="gsc-right-header BtnGroup hidden">
              <li
                className={`BtnGroup-item ${orderBy === 'oldest' ? 'BtnGroup-item--selected' : ''}`}
                aria-current={orderBy === 'oldest'}
              >
                <button className="btn" onClick={() => setOrderBy('oldest')}>
                  {t('oldest')}
                </button>
              </li>
              <li
                className={`BtnGroup-item ${orderBy === 'newest' ? 'BtnGroup-item--selected' : ''}`}
                aria-current={orderBy === 'newest'}
              >
                <button className="btn" onClick={() => setOrderBy('newest')}>
                  {t('newest')}
                </button>
              </li>
            </ul>
          ) : null}
        </div>

        {shouldShowCommentBox && inputPosition === 'top' ? mainCommentBox : null}

        <div className={`gsc-timeline ${!data.totalCommentCount ? 'hidden' : ''}`}>
          {!data.isLoading
            ? data.frontComments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  replyBox={
                    token && !data.isLocked ? (
                      <CommentBox
                        discussionId={data.discussion.id}
                        context={repo}
                        onSubmit={frontMutators.addNewReply}
                        replyToId={comment.id}
                      />
                    ) : undefined
                  }
                  onCommentUpdate={frontMutators.updateComment}
                  onReplyUpdate={frontMutators.updateReply}
                />
              ))
            : null}

          {data.numHidden > 0 ? (
            <div className="pagination-loader-container gsc-pagination">
              <button
                className="gsc-pagination-button color-border-primary"
                onClick={increaseSize}
                disabled={data.isLoadingMore}
              >
                <span className="color-text-secondary">
                  {t('hiddenItems', { count: data.numHidden })}
                </span>
                <span className="color-text-link font-semibold">
                  {data.isLoadingMore ? t('loading') : t('loadMore')}…
                </span>
              </button>
            </div>
          ) : null}

          {!data.isLoading
            ? data.backComments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  replyBox={
                    token && !data.isLocked ? (
                      <CommentBox
                        discussionId={data.discussion.id}
                        context={repo}
                        onSubmit={backMutators.addNewReply}
                        replyToId={comment.id}
                      />
                    ) : undefined
                  }
                  onCommentUpdate={backMutators.updateComment}
                  onReplyUpdate={backMutators.updateReply}
                />
              ))
            : null}
        </div>

        {shouldShowCommentBox && inputPosition !== 'top' ? mainCommentBox : null}
      </div>
    </div>
  );
}
