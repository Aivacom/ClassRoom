//
//  UITextField+SYAdditions.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/10.
//  Copyright © 2020 SY. All rights reserved.
//

#import "UITextField+SYAdditions.h"
#import <objc/runtime.h>

@implementation UITextField (SYAdditions)


- (void)setMaxInputLenth:(NSInteger)maxLen
{
    NSString *toBeString = self.text;
    //获取高亮部分
    UITextRange *selectedRange = [self markedTextRange];
    UITextPosition *position = [self positionFromPosition:selectedRange.start offset:0];
    
    if (!position || !selectedRange) {
        if (toBeString.length > maxLen) {
            NSRange rangeIndex = [toBeString rangeOfComposedCharacterSequenceAtIndex:maxLen];
            if (rangeIndex.length == 1) {
                self.text = [toBeString substringToIndex:maxLen];
            }
            else {
                NSRange rangeRange = [toBeString rangeOfComposedCharacterSequencesForRange:NSMakeRange(0, maxLen)];
                self.text = [toBeString substringWithRange:rangeRange];
            }
        }
    }
}

#pragma mark - Event
- (BOOL)yy_isInputNum:(NSString *)string
{
    if (0 == string.length) {
        return NO;
    }
    NSString *regex = @"[0-9]*";
    NSPredicate *predicate = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", regex];
    if ([predicate evaluateWithObject:string]) {
        return YES;
    }
    return NO;
}

- (void)textEditingChanged:(UITextField *)textField
{
    if (self.yy_maxLength) {
        [textField setMaxInputLenth:self.yy_maxLength];
    }
}

#pragma mark - Getter & Setter
- (void)setYy_maxLength:(NSUInteger)yy_maxLength
{
    objc_setAssociatedObject(self, @selector(yy_maxLength), @(yy_maxLength), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    [self addTarget:self action:@selector(textEditingChanged:) forControlEvents:UIControlEventEditingChanged];
}

- (NSUInteger)yy_maxLength
{
    NSNumber *maxLength = objc_getAssociatedObject(self, @selector(yy_maxLength));
    return maxLength.unsignedIntValue;
}

@end
