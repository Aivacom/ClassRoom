//
//  MBProgressHUD+SYHUD.m
//  SYLiteDevToolKit
//
//  Created by iPhuan on 2019/8/26.
//


#import "MBProgressHUD+SYHUD.h"


@implementation MBProgressHUD (SYHUD)

+ (void)jly_showToast:(NSString *)message {
    [self jly_showToast:message duration:1.6f];
}


+ (void)jly_showToast:(NSString *)message duration:(NSTimeInterval)duration {
    [self jly_showToast:message margin:13 duration:duration];
}

+ (void)jly_showToast:(NSString *)message margin:(CGFloat)margin duration:(NSTimeInterval)duration {
    UIView *window = [UIApplication sharedApplication].keyWindow;
    [self hideHUDForView:window animated:YES];
            
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:window animated:YES];
    hud.userInteractionEnabled = NO;
            
    hud.contentColor = [UIColor whiteColor];
    hud.margin = margin;

    hud.bezelView.style = MBProgressHUDBackgroundStyleSolidColor;
    hud.bezelView.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
    hud.bezelView.layer.cornerRadius = 6.0f;
            
    hud.mode = MBProgressHUDModeText;
    //    hud.label.text = message;
    //    hud.label.font = [UIFont systemFontOfSize:16];
            
    hud.detailsLabel.text = message;
    hud.detailsLabel.font = [UIFont systemFontOfSize:16];
                
    [hud hideAnimated:YES afterDelay:duration];
}

+ (void)jly_showActivityIndicator {
    [self jly_showActivityIndicatorWithMessage:nil];
}

+ (void)jly_showLoadingActivityIndicator {
    [self jly_showActivityIndicatorWithMessage:@"加载中..."];
}

+ (void)jly_showActivityIndicatorWithMessage:(NSString *)message {
    UIView *window = [UIApplication sharedApplication].keyWindow;
    [self hideHUDForView:window animated:YES];
    
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:window animated:YES];
    hud.backgroundView.style = MBProgressHUDBackgroundStyleSolidColor;
    hud.backgroundView.color = [UIColor colorWithWhite:0.f alpha:0.1f];
    
    hud.contentColor = [UIColor whiteColor];
//    hud.margin = 13;
    
    hud.bezelView.style = MBProgressHUDBackgroundStyleSolidColor;
    hud.bezelView.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
    hud.bezelView.layer.cornerRadius = 6.0f;
    
    if (message.length) {
        hud.label.text = message;
        hud.label.font = [UIFont systemFontOfSize:13];
    }
    
    [hud hideAnimated:YES afterDelay:5.f];
}

+ (void)jly_hideActivityIndicator {
    UIView *window = [UIApplication sharedApplication].keyWindow;
    [self hideHUDForView:window animated:YES];
}



@end
