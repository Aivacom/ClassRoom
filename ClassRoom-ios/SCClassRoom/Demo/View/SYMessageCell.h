//
//  SYMessageCell.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/6.
//  Copyright © 2020 SY. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN
@class SYMessageTxtModel;
@interface SYMessageCell : UITableViewCell

/// 设置数据
/// @param userId userId description
/// @param teacherId teacherId description
/// @param txtModel txtModel description
- (void)setDataWithUserId:(NSString *)userId
                teacherId:(NSString *)teacherId
                 txtModel:(SYMessageTxtModel *)txtModel;

@end

NS_ASSUME_NONNULL_END
