const moment = require('moment');
const { Schema, model, Types } = require('mongoose');

//nests the replies to comments in the comment as we won't pull for this information separately
const ReplySchema = new Schema(
    {
        //set custom id to avoid confusion with parent comment_id/able to do by const Types from mongoose
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String
        },
        writtenBy: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
)

const CommentSchema = new Schema(
    {
        writtenBy: {
            type: String
        },
        commentBody: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
        },
        // use replyschema to validate data for a reply
        replies: [ReplySchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
)

CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length
})

const Comment = model('Comment', CommentSchema)

module.exports = Comment