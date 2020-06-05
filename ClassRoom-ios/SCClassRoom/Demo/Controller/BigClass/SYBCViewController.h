//
//  SYBCViewController.h
//  SCClassRoom
//
//  Created by Huan on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface SYBCViewController : UIViewController

@property (nonatomic, copy) NSString *roomId;
@property (nonatomic, copy) NSString *nickName;
@property (nonatomic, copy) NSString *studentUid;               //当前学生uid

@end

NS_ASSUME_NONNULL_END
