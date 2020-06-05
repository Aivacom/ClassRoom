//
//  SYConsoleManager.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYConsoleManager.h"

@interface SYConsoleManager ()<UITextViewDelegate>

@property (nonatomic, strong) UITextView *textView;         // 控制台内容
@property (nonatomic, strong) UIView *parentView;           // 父视图
@property (nonatomic, strong) NSDateFormatter *formatter;   // 时间转换
@property (nonatomic, assign) BOOL draging;                 // 是否正在拖动
@property (nonatomic, assign) int lineCount;                // 总行数

@end

@implementation SYConsoleManager

+ (instancetype)sharedManager
{
    static SYConsoleManager *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[self alloc] init];
    });
    return instance;
}

#pragma mark - Event
- (void)insertOperateString:(NSString *)string
{
    NSLog(@"%@", string);
    self.lineCount += 1;
    if (self.lineCount >= 5000) {
        [self removeAllOperateString];
    }
    
    [self.textView insertText:[NSString stringWithFormat:@"%@: %@ \n", [self getCurrentTimeString], string]];
    
    if (!self.draging) {
        [self.textView scrollRangeToVisible:NSMakeRange(self.textView.text.length, 1)];
    }
}

- (void)removeAllOperateString
{
    self.textView.text = @"";
}

- (void)removeParentView
{
    [self removeAllOperateString];
    [self.textView removeFromSuperview];
    self.parentView = nil;
}

- (void)showOrHiddenOperateView:(UIView *)parentView rightView:(nonnull UIView *)rightView
{
    self.parentView = parentView;
    
    if (!self.textView.superview) {
        [parentView addSubview:self.textView];
        [self.textView mas_makeConstraints:^(MASConstraintMaker *make) {
            if (@available(iOS 11.0, *)) {
                make.left.mas_equalTo(parentView.mas_safeAreaLayoutGuideLeft);
            } else {
                make.left.mas_offset(0.f);
            }
            make.top.mas_equalTo(parentView.mas_bottom);
            make.height.mas_offset(250.f);
            make.right.mas_equalTo(rightView.mas_left);
        }];
        [parentView layoutIfNeeded];
        [UIView animateWithDuration:0.5 animations:^{
            [self.textView mas_updateConstraints:^(MASConstraintMaker *make) {
                make.top.mas_equalTo(parentView.mas_bottom).mas_offset(- 250.f);
            }];
            [parentView layoutIfNeeded];
        }];
    } else {
        [UIView animateWithDuration:0.5 animations:^{
            [self.textView mas_updateConstraints:^(MASConstraintMaker *make) {
                make.top.mas_equalTo(parentView.mas_bottom);
            }];
            [parentView layoutIfNeeded];
        } completion:^(BOOL finished) {
            [self.textView removeFromSuperview];
        }];
    }
}

- (NSString *)getCurrentTimeString
{
    NSDate *date = [NSDate date];
    NSString *str = [self.formatter stringFromDate:date];
    return str;
}

- (void)writeToFile:(NSString *)path
{
    NSString *strFinalPath=[NSString stringWithFormat:@"%@/console.txt", path];
    BOOL result = [self.textView.text writeToFile:strFinalPath atomically:YES encoding:NSUTF8StringEncoding error:nil];
    [self insertOperateString:[NSString stringWithFormat:@"write result: %d", result]];
}

#pragma mark - UIScrollViewDelegate
- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView
{
    self.draging = YES;
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView
{
    self.draging = NO;
}

#pragma mark - Getter & Setter
- (UITextView *)textView
{
    if (!_textView) {
        UITextView *view = [UITextView new];
        view.backgroundColor = [UIColor grayColor];
        view.textColor = [UIColor whiteColor];
        view.editable = NO;
        view.delegate = self;
        _textView = view;
    }
    return _textView;
}

- (NSDateFormatter *)formatter
{
    if (!_formatter) {
        NSDateFormatter *formatter = [NSDateFormatter new];
        [formatter setDateFormat:@"HH:mm:ss"];
        _formatter = formatter;
    }
    return _formatter;
}

@end
