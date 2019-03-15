import { Controller, Post, Body, HttpException, UseGuards, Put, Param, Delete } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ArticleDTO, NoteArticleDto } from './article.dto';
import { ArticleService } from './article.service';
import { UserInfoDTO } from 'src/user/user.dto';
import { AuthGaurd } from 'src/shared/auth.gaurd';
import { isNumber } from 'util';

@Controller('article')
export class ArticleController {
    constructor(private readonly userService: UserService, private articleService: ArticleService){}

    @Post()
    @UseGuards(new AuthGaurd())
    async create(@Body() articleData: ArticleDTO){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        return this.articleService.create(logguedUser.id, articleData);
    }
    
    @Put(':articleId')
    @UseGuards(new AuthGaurd())
    async update(@Param('articleId') articleId, @Body() articleData: Partial<ArticleDTO>){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }


        return this.articleService.update(logguedUser.id, articleId, articleData) ;
    }  

    @Delete(':articleId')
    @UseGuards(new AuthGaurd())
    async delete(@Param('articleId') articleId){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        
        return this.articleService.delete(logguedUser.id, articleId) ;
    }
    
    @Post(':articleId/note')
    @UseGuards(new AuthGaurd())
    async noteArticle(@Param('articleId') articleId, @Body() data: NoteArticleDto){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }

        if(!data.grade || !isNumber(data.grade) ){
            throw new HttpException('Grade not defined', 404);
        }
        return this.articleService.noteArticle(logguedUser.id, articleId, data.grade) ;
    }

    @Post(':articleId/comment')
    @UseGuards(new AuthGaurd())
    async addCommentArticle(@Param('articleId') articleId, @Body() data: any){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        return this.articleService.addCommentArticle(logguedUser.id, articleId, data.content);
    }

    @Delete('/comment/:commentId')
    @UseGuards(new AuthGaurd())
    async deleteCommentArticle(@Param('commentId') commentId){
        let logguedUser:UserInfoDTO = await this.userService.getLoggedUser();
        if (logguedUser === undefined) {
            throw new HttpException('User does not exist!', 404);
        }
        
        return this.articleService.deleteCommentArticle(logguedUser.id, commentId) ;
    }

}
