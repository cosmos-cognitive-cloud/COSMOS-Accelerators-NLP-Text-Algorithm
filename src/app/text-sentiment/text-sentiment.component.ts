import { Component, OnInit, Input, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CognitiveApiComponent } from '../cognitive-api.component';
import { TextDataService } from '../services/text-data.service';
import { CognitiveApiService } from '../services/cognitive-api.service';
import { ISentiment } from '../models/sentiment.model';
import { ILanguageDetect } from '../models/language-detection.model';
import { ILanguageKeyPhrase } from '../models/language-keyphrase.model';

@Component({
    selector: 'text-sentiment',
    templateUrl: './text-sentiment.component.html',
    styleUrls: ['./text-sentiment.component.css']
})
export class TextSentimentComponent extends CognitiveApiComponent implements OnInit {
    sentiment: ISentiment;
    languageDetect: ILanguageDetect;
    languageKeyPhrases: ILanguageKeyPhrase;
    analysisText = "";
    sampleEnglishPositiveText = "I had a wonderful experience! The rooms were wonderful and the staff were helpful.";
    sampleEnglishNegativeText = "I had a terrible time at the hotel. The staff were rude and the food was awful.";
    sampleSpanishPositiveText = "Los caminos que llevan hasta Monte Rainier son espectaculares y hermosos.";
    sampleSpanishNegativeText = "La carretera estaba atascada. Había mucho tráfico el día de ayer.";
    textToAnalyze = "";
    detectedLanguageISOName = "";
    detectedLanguage = "";
    keyPhrases: Array<{ phrase:string}> ;

    showJSON = false;
    showCodeButtons = true;
    
    apiTitle = 'Text Analytics API';
    apiBackgroundImage = 'https://cosmosstore.blob.core.windows.net/cognitive-creative-content/Page%20Header%20VIdeos/COSMOS-CognitiveIntelligence_828';
    apiDescription = 'Detect sentiment, key phrases, topics, and language from your text.';
    apiReferenceUrl = 'https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0';

    public constructor(
        private titleService: Title, 
        private textDataService: TextDataService, 
        private cognitiveApiService: CognitiveApiService) {
        super();
        this.titleService.setTitle('Text Analytics API');
    }

    ngOnInit() {
        this.textToAnalyze = this.sampleEnglishPositiveText;
        this.isLoading = false;
        //this.refreshDetection();
    }

    public analyzeText() {
        this.refreshDetection();
    }

    public insertEnglishPositiveText() {
        this.textToAnalyze = this.sampleEnglishPositiveText;
        this.refreshDetection();
    }

    public insertEnglishNegativeText() {
        this.textToAnalyze = this.sampleEnglishNegativeText;
        this.refreshDetection();
    }

    public insertSpanishPositiveText() {
        this.textToAnalyze = this.sampleSpanishPositiveText;
        this.refreshDetection();
    }

    public insertSpanishNegativeText() {
        this.textToAnalyze = this.sampleSpanishNegativeText;
        this.refreshDetection();
    }

    public toggleJSON(b: boolean) {
        this.showJSON = b;
    }

    public score() {
        return this.sentiment && this.sentiment.documents.length > 0 ?
            (Math.round(this.sentiment.documents[0].score * 100)).toString() + '%' : '';
    }

    private refreshDetection() {
        this.sentiment = null;
        this.isLoading = true;

        this.analysisText = "";

        this.detectedLanguageISOName = "";
        this.detectedLanguage = "";

        if(this.textToAnalyze.trim().length == 0)
        {
            this.errorMessage = "Enter text to Analyze";
            this.isLoading = false;
            this.analysisText = "";
        }
        else
        {
            this.textDataService.analyzeSentiment(this.textToAnalyze)
                .then(sentiment => {
                    this.sentiment = sentiment;

                })
                .catch((error) => {
                    this.errorMessage = error;
                    this.isLoading = false;
                    return;
                });

            this.textDataService.analyzeLanguage(this.textToAnalyze)
            .then(languageDetect => {
                this.languageDetect = languageDetect;
                
                if(this.languageDetect.documents.length > 0)
                {
                    if(this.languageDetect.documents[0].detectedLanguages.length > 0)
                    {
                        this.detectedLanguageISOName = this.languageDetect.documents[0].detectedLanguages[0].iso6391Name;
                        this.detectedLanguage = this.languageDetect.documents[0].detectedLanguages[0].name;

                        this.textDataService.analyzeKeyPhrases(this.textToAnalyze,this.detectedLanguageISOName)
                            .then(languageKeyPhrases => {
                                this.languageKeyPhrases = languageKeyPhrases;
                                this.keyPhrases = languageKeyPhrases.documents[0].keyPhrases;
                            })
                            .catch((error) => {
                                this.errorMessage = error;
                                this.isLoading = false;
                                return;
                            });
                    }


                }

                
            })
            .catch((error) => {
                this.errorMessage = error;
                this.isLoading = false;
                return;
            });

          this.isLoading = false;  
        }
    }
}