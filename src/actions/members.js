// import db from '../firebase/firebase';
import { getMembersByAccountId, getMembersById, createMember, updateMember } from '../api/members';
import _ from 'underscore';
import moment from 'moment';
moment.locale('th');
export const startAddMember = (member) => {
    // console.log('before api ',member)
    return dispatch => {
        return createMember(member)
            .then(result => {
                if (result.data.inserted) {
                    // console.log('action', member)
                    return getMembersById(member.memberId, member.accountId)
                        .then(newData => {
                            dispatch(addMembers(newData.data))
                            return {
                                error: false,
                                msg: 'Your member has been successfully created.'
                            }
                        })
                } else {
                    return {
                        error: true,
                        msg: result.data.msg
                    }
                }
            })
    }
}

export const startGetMembers = (accountId) => {
    return dispatch => {
        return getMembersByAccountId(accountId)
            .then(row => {
                // console.log('action get', row.data)
                dispatch(setMembers(row.data))
            })
    }
}


export const startUpdateMember = (member) => {
    return dispatch => {
        return updateMember(member)
            .then(result => {
                if (result.data.updated) {
                    dispatch(updateMembers(member))
                    return {
                        error: false,
                        msg: 'Your member has been successfully updated.'
                    }
                } else {
                    return {
                        error: true,
                        msg: result.data.msg
                    }
                }
            })

    }
}

export const setMembers = (members) => ({
    type: 'SET_MEMBERS',
    members
});
export const updateMembers = (member) => ({
    type: 'UPDATE_MEMBERS',
    member
});
export const addMembers = (member) => ({
    type: 'ADD_MEMBERS',
    member
});
