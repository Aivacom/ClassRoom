//
//  SYConstant.m
//  SCClassRoom
//
//  Created by Huan on 2020/3/6.
//  Copyright © 2020 SY. All rights reserved.
//

CGFloat const kLeftOrRightConstraints = 15.f;
NSString * const kRoomAttKeyForTeacher = @"Teacher";
NSString * const kRoomAttKeyForAnchor = @"StudentAnchor";
NSString * const kPeerAttKeyLinkIdForTeacher = @"linkId";
NSString * const kRoomAttKeyOperationOnline = @"online";

//用户角色
NSString * const kRoleKey = @"role";                        //角色的key
NSString * const kRoleAnchor = @"1";                        //主播
NSString * const kRoleAudience = @"2";                      //观众

//申请举手/取消举手
NSString * const kHand = @"hand";                           //key
NSString * const kRequireHand = @"1";                       //申请举手
NSString * const kCancleHand = @"0";                        //取消举手

//老师同意连麦/断麦
NSString * const kMike = @"mike";                           //key
NSString * const kAgreeMike = @"1";                         //老师同意连麦
NSString * const kCloseMike = @"0";                         //断开连麦

//聊天室消息
NSString * const kChatRoomMessage = @"message";     //聊天室消息

//n次渲染失败后显示默认图
int const kRenderFailCount = 2;

// 开启/关闭举手功能
NSString * const kOpenHand = @"1";                          // 开启举手
NSString * const kCloseHand = @"0";                         // 关闭举手
// 全员禁言
NSString * const kOpenClassMute = @"1";                     // 开启全员禁言
NSString * const kCloseClassMute = @"0";                    // 关闭全员禁言
// 上课下课
NSString * const kClassStateStart = @"1";                   // 上课
NSString * const kClassStateEnd = @"0";                     // 下课
// 视频流开启/关闭
NSString * const kVideoOpen = @"1";                
NSString * const kVideoClose = @"0";
// 音频流开启/关闭
NSString * const kAudioOpen = @"1";
NSString * const kAudioClose = @"0";
//个人禁言
NSString * const kMute = @"mute";                           //key
NSString * const kOpenMute = @"1";                          //开启个人禁言
NSString * const kCloseMute = @"0";                         //关闭个人禁言
